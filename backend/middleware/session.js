/**
 * Created by soldovkij on 13.06.17.
 */

const session            = require('express-session');
const RedisStore         = require('connect-redis')(session);

const sessionConfigModel = require('../models/config/session');
const sessionConfig = new sessionConfigModel(require('../config/session.json'));

function middleware(app) {
    app.use(session({
        store            : new RedisStore({
            host     : sessionConfig.redisHost,
            port     : sessionConfig.redisPort,
            db       : sessionConfig.redisDBIndex,
            ttl      : sessionConfig.redisTTL,
            logErrors: true
        }),
        secret           : sessionConfig.secret,
        resave           : false,
        saveUninitialized: true
    }));
}
module.exports = middleware;