/**
 * Created by soldovkij on 08.06.17.
 */

const Model = require('objectmodel');

const serverConfig = new Model({
    defaultHostname: String,
    secret: String,
    domains: Object
});

module.exports = serverConfig;