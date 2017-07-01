/**
 * Created by soldovkij on 16.06.17.
 */

import { getBulkObject, pageHack, getApiUrl } from 'common/modules/fetchUtils';
import globalStore from 'common/modules/appData';

export function clientFetch(fetch, fetchRules, completeProps, success, fail, componentName, force, chunkCache) {
    let preloadState = globalStore.take('preloadStates') || {};

    let bulkLinks            = {};
    let allBulkObjects       = {};

    let preloadComponentData = preloadState[componentName] || {};

    if (force || !preloadComponentData) {
        let componentData = {};

        fetchRules.forEach((fetchItem) => {
            let bulkObject;
            let propName   = Object.keys(fetchItem)[0];
            let requestURL = fetchItem[propName];

            if (preloadComponentData) {
                if (preloadComponentData[propName] && !chunkCache) return;
            }

            pageHack(componentName, requestURL, completeProps);

            requestURL                     = decodeURIComponent(getApiUrl(requestURL, completeProps, {
                withApi: false,
                withCityLang: false
            }));
            bulkObject                     = getBulkObject(requestURL);
            bulkLinks[bulkObject.url]      = {
                componentName: componentName,
                propName: propName
            };
            allBulkObjects[bulkObject.url] = bulkObject.value;
        });

        if (Object.keys(allBulkObjects).length > 0) {
            fetch.post('/fetch/data', allBulkObjects)
                 .then(({ data }) => {
                     data = data.data;

                     for (let prop in data) {
                         let propName  = bulkLinks[prop].propName;
                         let propKey   = Object.keys(data[prop])[0];
                         let propValue = data[prop][propKey];

                         componentData[propName] = propValue;
                     }

                     success(componentData);

                     preloadComponentData = Object.assign(preloadComponentData, componentData);
                 })
                 .catch(error => {
                     fail(error);
                 });
        }
    } else {
        // console.log("!!")
        // success(preloadState[componentName]);
    }
}

export function updateCache(componentName, componentData, propName) {
    let preloadState = globalStore.take('preloadStates') || {};

    if (componentName && componentData && propName) {
        preloadState[componentName][propName] = componentData;
    }
}