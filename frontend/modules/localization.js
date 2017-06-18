/**
 * Created by soldovkij on 13.06.17.
 */

class Localization {
    globalLoc = {};

    constructor() {
        this.currentLang = 'ru';
    }

    changeLang(lang) {
        this.currentLang = lang;
    }

    set(JSON) {
        if (!JSON) throw new Error('Not set JSON file with translates');

        this.globalLoc = JSON;
    }

    get(localLoc, key) {
        let is_global = arguments.length === 1;
        let value     = '';

        if (is_global) {
            key = localLoc;
        }

        if (!is_global) {
            value = this.findValue(localLoc, key);
        }

        if (!value) {
            value = this.findValue(this.globalLoc, key);
        }

        return value || key;
    }

    findValue(strings, key) {
        if (key in strings) {
            if (this.currentLang in strings[key]) {
                return strings[key][this.currentLang];
            } else {
                return key;
            }
        } else {
            return null;
        }
    }
}

module.exports = new Localization();