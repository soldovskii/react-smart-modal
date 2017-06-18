/**
 * Created by soldovskij on 14.04.17.
 */

const apiRequest    = require('backend/modules/fetch/apiFetch');
const { getApiUrl } = require('common/modules/fetchUtils');

function routes(app) {
    app.post('/fetch/data', (req, res) => {
        // temporary log
        if (req && req.session && !req.session.city) {
            console.log('Bulk request lost city');
            console.log(req.session);
            console.log(req.body);
        }

        let url = decodeURIComponent(getApiUrl('bulk', req.session, { withApi: true, withCityLang: true }));
        apiRequest(url, req, res);
    });
}

module.exports = routes;