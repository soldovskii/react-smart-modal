/**
 * Created by soldovkij on 14.06.17.
 */

export function generateMediaQuery(queryGroups, withMedia = false) {
    let sectionQuery = '';
    queryGroups.forEach((queryGroup, indexOfGroup) => {

        let countOfQuery = 0;
        for (let queryName in queryGroup) {
            let queryValue = queryGroup[queryName];

            if (queryValue) {
                sectionQuery += ((withMedia && countOfQuery === 0 && indexOfGroup === 0) ? '@media ' : '')
                    + (indexOfGroup > 0 && countOfQuery === 0? ', ' : '')
                    + (countOfQuery > 0 ? ' and ' : '')
                    + (
                        queryValue !== 'value'
                            ?
                            '(' + queryName + ':' + queryValue + ')'
                            :
                            queryName
                    );
                countOfQuery += 1;
            }
        }
    });

    return sectionQuery;
}

export function getMinMaxWidth(queryGroups) {
    let finded   = false;
    let minWidth = null;
    let maxWidth = null;

    queryGroups.forEach((queryGroup) => {
        if (finded) return;
        finded = 'min-width' in queryGroup && 'max-width' in queryGroup;
        if (finded) {
            minWidth = parseInt(queryGroup['min-width']);
            maxWidth = parseInt(queryGroup['max-width']);
        }
    });

    if (finded) {
        return { minWidth, maxWidth };
    }
}

export function checkMediaQueryConfig(config) {
    let sections = Object.keys(config);
    let result   = null;

    sections.forEach(sectionName => {
        let queryGroups = config[sectionName];

        let params = getMinMaxWidth(queryGroups);

        if (params) {
            if (!result) result = {};
            result[sectionName] = params;
        } else {
            console.warn('Rules "min-width" and "max-width" not found in section ' + sectionName);
        }
    });

    return result;
}

export function generateMediaQueryLinks(config, build, publicPath = '/public') {

    let links    = [];
    let sections = Object.keys(config);

    sections.forEach(sectionName => {
        let href         = publicPath + '/' + sectionName + '.css' + (build ? `?build=${build}` : '');
        let queryGroups  = config[sectionName];
        let sectionQuery = generateMediaQuery(queryGroups);

        links.push(`<link rel="stylesheet" media="${sectionQuery}" href="${href}" />`);
    });

    return links;
}
