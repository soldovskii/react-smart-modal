/**
 * Created by soldovkij on 19.06.17.
 */

import React     from 'react';

import renderApp from 'frontend/modules/renderApp';
import globalStore from 'common/modules/globalStore';

import { routes } from './routes';

// Читаем признак isMobile
let { isMobile } = globalStore.take('serverProps') || {};

// Если isMobile равен true, значт рендерим мобильную версию
if (isMobile === true) renderApp(routes);
