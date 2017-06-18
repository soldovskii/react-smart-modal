/**
 * Created by soldovkij on 08.06.17.
 */

export default class BaseException {

    static DEFAULT_CODE = 500;
    static DEFAULT_MESSAGE = 'Unknown message';

    constructor(message, code, errors) {
        this._message = message || BaseException.DEFAULT_MESSAGE;
        this._code = code || BaseException.DEFAULT_CODE;
        this._errors = errors || null;
    }

    getMessage() {
        return this._message;
    }

    getCode() {
        return this._code;
    }

    getErrors() {
        return this._errors;
    }
}