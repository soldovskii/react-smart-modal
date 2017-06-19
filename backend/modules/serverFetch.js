/**
 * Created by soldovkij on 16.06.17.
 */

import { getBulkObject, pageHack, getApiUrl } from 'common/modules/fetchUtils';

export default function serverFetch(req, res, fetch, renderProps, serverProps, success, fail) {
    // Свойства используемый для замены переменных из url
    let completeProps = Object.assign({}, renderProps.params, serverProps);

    // Получить компоненты учавствующие в роуте, для которых нужно получить данные перед рендером
    let fetchedComponent = renderProps.components.filter(x => !!x.getFetchRules);

    // Массив для всех запросов
    let allBulkObjects = {};

    //Связь запрос - компонент
    let bulkLinks = {};

    // URL для запроса bulk
    let bulkUrl = decodeURIComponent(getApiUrl('bulk', completeProps, { withApi: true, withCityLang: true }));

    // Используется для передачи в window, что бы реакт имел полную картину о данных
    let preloadStates = {};

    fetchedComponent.forEach(component => {
        let fetchRules = component.getFetchRules();
        let bulkObject = {};

        fetchRules.forEach((fetchItem) => {
            let propName   = Object.keys(fetchItem)[0];
            let requestURL = fetchItem[propName];

            pageHack(component.fetchComponentName, requestURL, completeProps);

            requestURL                     = decodeURIComponent(getApiUrl(requestURL, completeProps, {
                withApi     : false,
                withCityLang: false
            }));
            bulkObject                     = getBulkObject(requestURL);
            bulkLinks[bulkObject.url]      = {
                componentName: component.fetchComponentName,
                propName     : propName
            };
            allBulkObjects[bulkObject.url] = bulkObject.value;
        });
    });

    console.log('------------');
    console.log(allBulkObjects);
    console.time('request');

    fetch(bulkUrl, req, res, { json: allBulkObjects, manual: true })
        .then(({ data }) => {
            for (let prop in data) {
                let componentName = bulkLinks[prop].componentName;
                let propName      = bulkLinks[prop].propName;
                let propKey       = Object.keys(data[prop])[0];
                let propValue     = data[prop][propKey];

                if (!preloadStates[componentName]) {
                    preloadStates[componentName] = {};
                }
                preloadStates[componentName][propName] = propValue;
            }

            success(preloadStates);

            console.timeEnd('request');
        })
        .catch(error => {
            fail(error);
        });
}

module.exports = serverFetch;