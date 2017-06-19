/**
 * Created by soldovkij on 13.06.17.
 */

import debug from './debug';

const configStore = {};

function getConfig(filename) {
    if (typeof configStore[filename] === 'undefined') {
        debug(`Include config for "${filename}"`);

        try {
            let json = require(`${filename}.json`);

            if (json) {
                configStore[filename] = json;
            } else {
                debug(`Config file ${filename}.json not found`);
                configStore[filename] = {};
            }
        } catch (e) {
            configStore[filename] = {};
        }
    }

    return configStore[filename];
}

function getValue(path, config, name) {
    let section = path.shift();
    let value   = config && section in config ? config[section] : null;

    name += '.' + section;

    if (value === null) {
        debug(name + ' not found');
        return null;
    }

    if (path.length) {
        if (typeof value !== 'object') {
            debug(`Config "${name}" have not section: "${section}"`);
            return null;
        }

        return getValue(path, value, name);
    }

    return value;
}

function configReader(key) {
    let path   = key.split('.');
    let name   = path.shift();
    let config = getConfig(name);

    return getValue(path, config, name);
}

module.exports = configReader;