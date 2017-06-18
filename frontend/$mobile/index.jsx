/**
 * Created by soldovskij on 07.06.17.
 */

import React     from 'react';

import renderApp from 'frontend/modules/renderApp';

import mediaQueryConfig           from 'common/config/mediaquery.json';
import { checkMediaQueryConfig }  from 'common/helpers/mediaquery';

import { routes } from './routes';

let curWidth    = window.innerWidth;
let maxWidth    = checkMediaQueryConfig(mediaQueryConfig)['mobile']['maxWidth'];
let isMobile    = curWidth <= maxWidth;
let firstRender = true;

let render = () => {
    let curWidth = window.innerWidth;

    if (isMobile === curWidth <= maxWidth) {
        if (!firstRender) return;
    } else {
        isMobile = !isMobile;
    }

    if (isMobile) {
        renderApp(routes, firstRender);
    }

    firstRender = false;

};

window.addEventListener('resize', render);

render();