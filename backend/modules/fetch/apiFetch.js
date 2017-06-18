/**
 * Created by soldovkij on 08.06.17.
 */

import FPMFetch from './fpmFetch';

import BaseException            from '../exceptions/BaseException';
import { ApiError, AuthError }  from '../exceptions/ApiException';

/**
 * Request API
 *
 *  Callbacks expample
 *  apiRequest(url, req, res, {
 *      skipForm: true,                     //skip form request
 *      skipAuth: true,                     //skip auth header
 *      form: obj,                          //form data
 *      json: obj                           //json data
 *      manual: true                        //use try catch around call this method
 *  });
 *
 *  Default body send as JSON, for send as FORM - use "form" in options
 *
 * @param {string} uri
 * @param {object} req
 * @param {object} res
 * @param {object} [options]
 */
async function apiRequest(uri, req, res, options) {
    if (!uri) throw new Error('Parameter uri is empty');
    if (typeof uri !== 'string') throw new Error('Parameter uri must be a string');

    let fpm = new FPMFetch(req);

    let { session, body } = req;

    let params = {
        uri        : uri,
        httpHeaders: {}
    };

    if (!skipAuth()) {
        if (session && session.token) {
            params.httpHeaders['Authorization'] = 'Bearer ' + session.token;
        }
    }

    if (!skipForm()) {
        if (options && options.form) {
            params.form = options.form;
        } else if (options && options.json) {
            params.json = options.json;
        } else {
            params.json = body;
        }
    }

    try {
        let response = await fpm.request(params);


        if (response.maintenance) {
            res.status(503).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <link data-react-helmet="true" rel="shortcut icon" href="/content/images/favicon.ico" type="image/x-icon"/>
                        <style>
                            html, body {
                                padding: 0;
                                margin: 0;
                                width: 100%;
                                height: 100%;
                            }
                            .image {
                                width: 100%;
                                height: 100%;
                            }
                        </style>
                    </head>
                    <body>
                        <p>Сайт временно недоступен</p>
                    </body>
                    </html>
                `);
        }

        let data = response.data || {};
        let code = response.code || null;

        let answer = { result: 'success', code: code, data: data };

        if (skipSend()) {
            return answer;
        } else {
            res.status(200).send(answer);
        }

    } catch (error) {
        if (error instanceof BaseException) {
            let answer;

            let msg    = error.getMessage();
            let code   = error.getCode();
            let errors = error.getErrors();

            if (code === 401) {
                answer = { code: code, message: msg, errors: errors };

                if (skipSend()) {
                    throw new AuthError(answer);
                } else {
                    res.status(500).send(answer);
                }

            } else if (code === 403) {
                answer = { code: code, message: 'STOP FLOOD', errors: errors };

                if (skipSend()) {
                    throw new ApiError(answer);
                } else {
                    res.status(500).send(answer);
                }
            } else {
                answer = { code: code, message: msg, errors: errors };
                if (skipSend()) {
                    throw new error.constructor(answer);
                } else {
                    res.status(500).send(answer);
                }
            }

        } else {
            if (skipSend()) {
                throw new ApiError({ message: error.message });
            } else {
                res.status(500).send({ message: error.message });
            }
        }
    }

    function skipSend() {
        return !!(options && options.manual);
    }

    function skipAuth() {
        return !!(options && options.skipAuth);
    }

    function skipForm() {
        return !!(options && options.skipForm);
    }
}

module.exports = apiRequest;