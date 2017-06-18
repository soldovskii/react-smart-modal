/**
 * Created by soldovkij on 13.06.17.
 */

/**
 * Clone urlencode-for-php/index.js
 * @type {encode}
 */

const flat = require('flat');

function encode(obj) {
    let flatted = flat(obj);
    let params  = [];

    for (let key in flatted) {
        params.push(dot2brackets(key) + '=' + encodeURIComponent(flatted[key])
                .replace(/[!'()*]/g, function (c) {
                    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
                })
        );
    }
    return params.join('&');
}

function dot2brackets(key) {
    let arr = key.split('.');
    for (let i = 1; i < arr.length; i++) {
        arr[i] = '[' + arr[i] + ']';
    }
    return arr.join('');
}

module.exports = encode;