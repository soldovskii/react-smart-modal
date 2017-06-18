/**
 * Created by soldovkij on 13.06.17.
 */

const Model = require('objectmodel');

const sessionConfig = new Model({
    redisHost   : String,
    redisPort   : Number,
    redisDBIndex: Number,
    redisTTL    : Number,
    secret      : String
});

module.exports = sessionConfig;