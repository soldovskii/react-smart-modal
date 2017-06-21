/**
 * Created by soldovkij on 16.06.17.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import globalStore from 'common/modules/globalStore';

function onUpdate() {
    let history       = globalStore.take('history', true);
    let historyScroll = globalStore.take('historyScroll', true);

    if (history && history.length > 1) {
        let last    = history[history.length - 1];
        let preLast = history[history.length - 2];

        if (historyScroll && last !== preLast) {
            window.scrollTo(0, 0);
        }
    }
}

export default function renderApp(routes) {
    ReactDOM.render(
        <Router onUpdate={onUpdate}
                history={browserHistory}
                routes={routes}/>,
        document.getElementById('root')
    );
}