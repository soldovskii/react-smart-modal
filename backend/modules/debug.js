/**
 * Created by soldovkij on 13.06.17.
 */

export default function debug(string, isError = true) {
    process.env.NODE_ENV !== 'production' && string && print(string);

    function print(string) {
        if (typeof string === 'object') {
            try {
                string = JSON.stringify(string);
            } catch (e) {
                console.log('Can not parse debug object: ' + string);
            }
        }

        if (isError) {
            console.error('DEBUG: ' + string);
        } else {
            console.warn('WARN: ' + string);
        }
    }
}