/**
 * Created by soldovkij on 15.06.17.
 */

import { formatPattern } from 'react-router/lib/PatternUtils';

export function getApiUrl(requestURL, params, options = { withApi: true, withCityLang: false }) {
    let APIUrl;

    if (options.withCityLang) requestURL = ':lang/:city/' + requestURL;
    if (options.withApi) requestURL = '/api/' + requestURL;

    APIUrl = formatPattern(requestURL, params);
    APIUrl = APIUrl.replace(/[^=&]+=(&|$)/g, '').replace(/&$/, '');

    return APIUrl;
}

export function getBulkObject(requestUrl) {
    let chunks = requestUrl.split('&');
    let length = chunks.length;
    let value  = {};

    if (length === 1) {
        return {
            url  : [chunks[0]],
            value: []
        };
    } else {
        for (let i = 1; i < length; i++) {
            let pair = chunks[i].split('=');

            value[pair[0]] = pair[1];
        }

        return {
            url  : [chunks[0]],
            value: value
        };
    }
}

export function pageHack(componentName, requestURL, completeProps) {
    if (componentName == 'Reviews') {
        if (requestURL.includes('page') && completeProps['page']) {
            let intPage = parseInt(completeProps['page']);

            if (isNaN(intPage)) {
                intPage = 0;
            }

            if (intPage < 0) {
                intPage = 0;
            }

            if (intPage > 0) {
                intPage = intPage - 1;
            }

            completeProps['page'] = intPage + '';
        }
    }
}