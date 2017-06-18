/**
 * Created by soldovkij on 08.06.17.
 */

const Model = require('objectmodel');

const PhpFpmConfig = new Model({
    sockFile: String,
    documentRoot: String
});

module.exports = PhpFpmConfig;