/**
 * Created by soldovkij on 13.06.17.
 */

function middleware(app) {
    app.use((req, res, next) => {
        if (req.session) {
            if(!req.session.lang) req.session.lang = 'ru';
            if(!req.session.city) req.session.city = 'spb';
        } else {
            req.session = {
                lang: 'ru',
                city: 'spb'
            };
        }

        next();
    });
}
module.exports = middleware;