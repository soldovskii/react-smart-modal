/**
 * Created by soldovkij on 08.06.17.
 */

import BaseException from './BaseException';

class BrowserException extends BaseException {
    constructor (message) {
        super(message || 'Common Browser exceptions');
    };
}

class BrowserNotSupportedException extends BrowserException {
    constructor (message) {
        super (message || 'Browser not supported');
    }
}

module.exports = {
    BrowserException, BrowserNotSupportedException
};
