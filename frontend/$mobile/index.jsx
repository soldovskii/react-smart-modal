/**
 * Created by soldovkij on 19.06.17.
 */

import React     from 'react';

import renderApp from 'frontend/modules/renderApp';
import globalStore from 'common/modules/globalStore';

import { routes } from './routes';

let { isMobile } = globalStore.take('serverProps') || {};

if (isMobile) {
    renderApp(routes, true);
}