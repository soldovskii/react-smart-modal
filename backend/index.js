/**
 * Created by soldovkij on 08.06.17.
 */

    //region Environment

const NODE_PATH = process.env.NODE_PATH;
const NODE_ENV  = process.env.NODE_ENV;
const BUILD     = process.env.NODE_BUILD;
const PORT      = process.env.PORT || 4000;
const DEBUG     = NODE_ENV !== 'production';

//endregion

//region Requires

// Builtin modules
const path = require('path');
const http = require('http');
const fs   = require('fs');

// Custom modules
const config     = require('backend/modules/config');
const apiRequest = require('backend/modules/fetch/apiFetch');

// React
const React              = require('react');
const { match }          = require('react-router');
const { RouterContext }  = require('react-router');
const { renderToString } = require('react-dom/server');
const Helmet             = require('react-helmet');

//react Routes
const { routes: reactMobileRoutes }  = require('../frontend/$mobile/routes');
const { routes: reactDesktopRoutes } = require('../frontend/$desktop/routes');

// Express
const express     = require('express');
const favicon     = require('serve-favicon');
const compression = require('compression');
const bodyParser  = require('body-parser');
const robots      = require('express-robots');
const useragent   = require('express-useragent');

// Middleware's
// const sessionMiddleware         = require('./middleware/session');
const sessionDefaultsMiddleware = require('./middleware/sessionDefaults');

// Route's
const bulkRoutes = require('./routes/bulk');

// MediaQuery helper
const mediaQueryConfig                                   = require('common/config/mediaquery.json');
const { checkMediaQueryConfig, generateMediaQueryLinks } = require('common/helpers/mediaquery');
checkMediaQueryConfig(mediaQueryConfig);

// Common modules
const globalStore = require('common/modules/globalStore');
const serverFetch = require('backend/modules/serverFetch');

//endregion

//region App config

const appConfig = {
    enabledServerRendering: config('common/config/app.enabledServerRendering')
};

//endregion

//region Launch info

console.log('\n=========== APP INFO ===========');
console.log('=> EXEC_FROM : ' + __dirname);
console.log('=> NODE_PATH : ' + path.resolve(NODE_PATH));
console.log('=> NODE_ENV  : ' + NODE_ENV);
console.log('=> BUILD     : ' + BUILD);
console.log('=> IS_DEBUG  : ' + DEBUG);
console.log('================================\n');

//endregion

//region Init express

const app        = express();
const httpServer = http.createServer();

app.use(function (error, req, res, next) {
    console.log(error.stack);
    res.status(500).send('Error server config');
});

// Enable GZip
app.use(compression({ level: 3 }));

// Path to static content
app.use('/public', express.static(__dirname + '/../app'));
app.use('/content/images', express.static(__dirname + '/../frontend/images'));
app.use('/content/fonts', express.static(__dirname + '/../frontend/fonts'));

// Favicon
try {
    app.use(favicon(__dirname + '/../frontend/images/favicon.ico'));
} catch (e) {
    console.error(e.message);
}

// Robots.txt
app.use(robots(__dirname + '/robots.txt'));

// JSON parser
app.use(bodyParser.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));

// Useragent
app.use(useragent.express());

// Middleware's
// sessionMiddleware(app);
sessionDefaultsMiddleware(app);

// Route's
bulkRoutes(app);

//View engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//endregion

const serverRendering = (req, res, build) => {
    let { isMobile = false } = req.useragent;

    let serverProps = {
        isMobile: isMobile
    };

    let routes = isMobile ? reactMobileRoutes : reactDesktopRoutes;

    match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            serverFetch(req, res, apiRequest, renderProps, req.session,
                (preloadStates) => {

                    console.time('ssr');

                    globalStore.flush();
                    globalStore.put('preloadStates', preloadStates);

                    let body = renderToString(
                        <RouterContext {...renderProps} />
                    );

                    res.render('index', {
                        body         : body,
                        build        : build,
                        isMobile     : isMobile,
                        styles       : generateMediaQueryLinks(mediaQueryConfig, build),
                        preloadStates: encodeURIComponent(JSON.stringify(preloadStates)),
                        serverProps  : encodeURIComponent(JSON.stringify(serverProps))
                    });

                    console.timeEnd('ssr');
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            res.status(404).send('Route not found');
        }
    });
};

const staticRender = (req, res, build) => {
    let { isMobile = false } = req.useragent;

    let serverProps = {
        isMobile: isMobile
    };

    res.render('index', {
        build      : build,
        isMobile   : isMobile,
        styles     : generateMediaQueryLinks(mediaQueryConfig, build),
        serverProps: encodeURIComponent(JSON.stringify(serverProps))
    });
};

app.get('*', (req, res) => {
    let build = DEBUG ? +new Date() : BUILD || '';

    if (appConfig.enabledServerRendering) {
        serverRendering(req, res, build);
    } else {
        staticRender(req, res, build);
    }
});

// Start to listen
httpServer.on('request', app);
httpServer.listen(PORT, function () {
    console.log(`Listening at http://localhost:${PORT}/`);
});