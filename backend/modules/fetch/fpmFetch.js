/**
 * Created by soldovkij on 08.06.17.
 */

/* eslint no-cond-assign: "off" */

import crypto            from 'crypto';
import fastcgiConnector  from 'fastcgi-client';
import urlencode         from '../urlencode';

import { ParseError, ApiError } from '../exceptions/ApiException';

import PHPFPMConfigModel from '../../models/config/phpfpm';
import ServerConfigModel from '../../models/config/server';

import phpfpmConf from '../../config/phpfpm.json';
import serverConf from '../../config/server.json';

const phpfpmConfig = new PHPFPMConfigModel(phpfpmConf);
const serverConfig = new ServerConfigModel(serverConf);

/**
 * phpfpm
 */
function phpfpm(options) {
    if (!options) throw new Error('Не передан параметр options');
    if (!options.documentRoot) throw new Error('Не передан параметр options.documentRoot');
    if (!options.sockFile) throw new Error('Не передан параметр options.sockFile');
    if (!options.secret) throw new Error('Не передан параметр options.secret');
    if (!options.request) throw new Error('Не передан параметр options.request');

    options                 = options || {};
    options.skipCheckServer = true;

    !options.host && (options.host = '127.0.0.1');
    !options.port && (options.port = 9000);
    !options.documentRoot && (options.documentRoot = '');
    !options.headerServerAddr && (options.serverAddr = '127.0.0.1');
    !options.headerServerPort && (options.serverAddr = 80);

    this.ready   = false;
    this.queue   = [];
    this.options = options;
    this.client  = fastcgiConnector(options);
    this.client.on('ready', () => {
        this.ready = true;
        this.executeQueue();
    });
}

/**
 * clear the queued tasks after connected to phpfpm
 */
phpfpm.prototype.executeQueue = function () {
    let item;

    while (item = this.queue.shift()) {
        this.run(item.requestObject, item.callback);
    }
};

/**
 * send command to phpfpm to run a php script
 */
phpfpm.prototype.run = function (requestObject, callback) {
    if (!requestObject) throw new Error('Не передан параметр requestObject');
    if (!requestObject.uri) throw new Error('Не передан параметр requestObject.uri');
    if (requestObject.json && typeof requestObject.json !== 'object') {
        throw new Error('Параметр запроса json может быть только объектом');
    }
    if (typeof requestObject !== 'string' && !requestObject.form && !requestObject.json) {
        throw new Error('В объекте запроса, если это не строка с URL должны быть поля from или json');
    }

    if (!requestObject.httpHeaders) {
        requestObject.httpHeaders = {};
    }

    // Параметры запроса в FPM
    let params = null;

    // Если в качестве объекта запроса строка, то это GET запрос
    if (typeof requestObject === 'string') {
        requestObject = {
            method: 'GET',
            uri   : requestObject
        };
    }

    // Если в объекте запроса передано поле form, но не уточнен метод запросв
    if (requestObject.form && !requestObject.method) {
        throw new Error('Уточните параметр method для запроса form. Допустимые значения "GET" или "POST"');
    }

    if (requestObject.form && requestObject.method) {
        if (requestObject.method !== 'GET' || requestObject.method !== 'POST') {
            throw new Error('Для запроса с полем form допустимые значения метода "GET" или "POST"');
        }
    }

    // Если в параметре запроса есть поле form и метод GET
    if (requestObject.form && requestObject.method === 'GET') {
        let queryString = urlencode(requestObject.form);

        requestObject.body = '';
        requestObject.uri += (requestObject.uri.indexOf('?') === -1) ? '?' + queryString : '&' + queryString;
    }

    // Если в параметре запроса есть поле form и метод POST
    if (requestObject.form && requestObject.method === 'POST') {
        requestObject.body          = urlencode(requestObject.form);
        requestObject.contentType   = 'application/x-www-form-urlencoded';
        requestObject.contentLength = requestObject.body.length;

        params = requestObject.form;
    }

    // Если в параметре запроса есть поле json, значит это POST запрос
    if (requestObject.json) {
        requestObject.body          = JSON.stringify(requestObject.json);
        requestObject.method        = 'POST';
        requestObject.contentType   = 'application/json';
        requestObject.contentLength = requestObject.body.length;

        params = requestObject.json;
    }

    // Создаем объект буфера для тела запроса
    if (requestObject.method === 'POST') {
        requestObject.body = new Buffer(requestObject.body, 'utf8');
    }

    // Если сокет еще не октрыт, то ставим запросы в очередь
    if (!this.ready) {
        return this.queue.push({ requestObject: requestObject, callback: callback });
    }

    // Навсякий случай приводим к верхнему регистру метод запроса
    requestObject.method = requestObject.method.toUpperCase();

    // Задаем URI специфичный для Phalcon
    requestObject.queryString = '_url=' + requestObject.uri;

    // Генерация хеша для сигнатуры
    let prepared  = requestObject.uri;
    let timestamp = Math.round(Date.now() / 1000);
    let sessionId = (this.options && this.options.request && this.options.request.session ? this.options.request.session.id : '');

    prepared += urlencode(params || '');
    prepared += this.options.secret;
    prepared += timestamp;
    prepared += sessionId;

    requestObject.httpHeaders['X-Data-Signature'] = crypto.createHash('md5').update(prepared).digest('hex');
    requestObject.httpHeaders['X-Data-Timestamp'] = timestamp;
    requestObject.httpHeaders['X-Data-SessionId'] = sessionId;

    let phpfile        = 'index.php';
    let scriptFilename = this.options.documentRoot + '/' + phpfile;

    let FASTCGI_REQ_HEADERS = {
        QUERY_STRING     : requestObject.queryString || '',
        REQUEST_METHOD   : requestObject.method,
        CONTENT_TYPE     : requestObject.contentType || '',
        CONTENT_LENGTH   : requestObject.contentLength || '',
        SCRIPT_FILENAME  : scriptFilename,
        SCRIPT_NAME      : phpfile,
        REQUEST_URI      : requestObject.uri,
        DOCUMENT_URI     : phpfile,
        DOCUMENT_ROOT    : this.options.documentRoot,
        SERVER_PROTOCOL  : 'HTTP/1.1',
        GATEWAY_INTERFACE: 'CGI/1.1',
        REMOTE_ADDR      : (this.request.connection && this.request.connection.remoteAddress) ? this.request.connection.remoteAddress : '127.0.0.1',
        REMOTE_PORT      : (this.request.connection && this.request.connection.remotePort) ? this.request.connection.remotePort : 1234,
        SERVER_ADDR      : this.options.headerServerAddr,
        SERVER_PORT      : this.options.headerServerPort,
        SERVER_NAME      : requestObject.serverName || this.options.serverAddr,
        SERVER_SOFTWARE  : 'node-phpfpm',
        REDIRECT_STATUS  : 200,
        REFERER          : (this.request.headers && this.request.headers['referer']) ? this.request.headers['referer'] : ''
    };

    for (let header in requestObject.httpHeaders) {
        let headerName                            = header.toUpperCase().replace(/-/g, '_');
        FASTCGI_REQ_HEADERS['HTTP_' + headerName] = requestObject.httpHeaders[header];
    }

    this.client.request(FASTCGI_REQ_HEADERS, function (error, request) {
        if (error) return callback(true, error.toString(), error.toString());

        let headers  = {};
        let response = '';
        let errors   = '';
        let status   = 200;

        request.stderr.on('data', function (data) {
            errors += data.toString('utf8');
        });

        request.stdout.on('data', function (data) {
            response += data.toString('utf8');
        });

        request.stdout.on('end', function () {
            if (!response) return callback(true, {}, 'Empty response body for ' + requestObject.uri);

            let headersString = response.match(/(^[\s\S]*?)\r\n\r\n/)[1];
            let headersArray  = headersString.split('\r\n');

            headersArray.map(header => {
                let delimiter = header.indexOf(':');
                let key       = header.substr(0, delimiter);
                let val       = header.substr(delimiter + 2);

                headers[key] = val;
            });

            if (headers['Status']) {
                status = parseInt(headers['Status']);
            }

            response = response.substr(headersString.length + 4); //remove headers and \r\n characters

            if (status >= 400) { //server errors, document and query errors, permissions restricts
                return callback(true, { status, headers, response }, errors);
            } else {
                return callback(false, { status, headers, response }, errors);
            }
        });

        if (requestObject.method === 'POST') {
            request.stdin._write(requestObject.body, 'utf8');
        }

        request.stdin.end();
    });
};

/**
 * Generate and send request and return promise object
 */
phpfpm.prototype.request = function (requestObject) {
    let promiseWorker = (resolve, reject) => {
        this.run(requestObject, function (error, output, errors) {
            //Объект ответа
            let result;

            // Пытаемся распарсить
            try {
                result = JSON.parse(output.response);
            } catch (e) {
                let info = requestObject.uri + '": ' + JSON.stringify(output.response);
                return reject(new ParseError('Can not parse response from "' + info));
            }

            // Если включен режим maintenance
            if (result.maintenance) {
                return resolve(result);
            }

            // Если произошла ошибка
            if (error) {
                let msg = result.message || 'Can not complete request "' + requestObject.uri;
                let code = result.code || output.status;
                let errors = result.data && result.data.errors || errors;
                return reject(new ApiError(msg, code, errors));
            }

            if (!result) {
                throw new ApiError('Empty response');
            }

            // Если код ответа не пришел или не равен 200
            if (!result.code || result.code !== 200) {
                let msg = result.message;
                let code = result.code || null;
                let errors = result.data && result.data.errors;
                return reject(new ApiError(msg, code, errors));
            }

            resolve(result);
        });
    };

    return new Promise(promiseWorker);
};

export default function FPMFetch(req) {
    return new phpfpm({
        documentRoot: phpfpmConfig.documentRoot,
        sockFile    : phpfpmConfig.sockFile,
        secret      : serverConfig.secret,
        request     : req || {}
    });
}