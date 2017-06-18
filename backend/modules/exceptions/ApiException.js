/**
 * Created by soldovkij on 08.06.17.
 */

import BaseException from './BaseException';

class AuthError extends BaseException {
    constructor(message, code = 401, errors = null) {
        super(message, code, errors);
    }
}

class ParseError extends BaseException {
    constructor(message, code = 500, errors = null) {
        super(message, code, errors);
    }
}

class ApiError extends BaseException {
    constructor(message, code = 500, errors = null) {
        super(message || 'Api error', code, errors);
    }
}

module.exports = {
    ParseError, ApiError, AuthError
};