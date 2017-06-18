let _store = {};

function put(key, value, replace = false) {
    if (replace) {
        return _store[key] = value;
    }

    if(_store[key]) {
        console.warn(`${key} already exist in storage`);
    } else {
        _store[key] = value;
    }
}

function take(key, any) {
    if (any) {
        return _store[key];
    }

    if(_store[key]) {
        return _store[key];
    } else {
        console.warn(`${key} not exist in storage`);
    }
}

function flush() {
    _store = {};
}

module.exports = {
    put, take, flush
};
