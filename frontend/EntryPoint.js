/**
 * Created by soldovkij on 16.06.17.
 * Webpack includes this file to common.js
 */

// Global Store module
import globalStore from 'common/modules/appData';

// Put into global storage data from server
if('__PRELOADED_STATES__' in window) {
    globalStore.put('preloadStates', window.__PRELOADED_STATES__);
}

if('__SERVER_PROPS__' in window) {
    globalStore.put('serverProps', window.__SERVER_PROPS__);
}

// Delete this from window in production
if (process.env.NODE_ENV === 'production') {
    delete window.__PRELOADED_STATES__;
    delete window.__SERVER_PROPS__;
}