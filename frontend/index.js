/**
 * Created by soldovkij on 16.06.17.
 * Webpack includes this file to common.js
 */

// Global Store module
import globalStore from 'common/modules/globalStore';

// Put into global storage data from server
globalStore.put('preloadStates', window.__PRELOADED_STATES__);

// Delete this from window in production
if (process.env.NODE_ENV === 'production') {
    delete window.__PRELOADED_STATES__;
}