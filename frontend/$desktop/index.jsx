/**
 * Created by soldovskij on 07.06.17.
 */

import React     from 'react';

import renderApp from 'frontend/modules/renderApp';

import mediaQueryConfig           from 'common/config/mediaquery.json';
import { checkMediaQueryConfig }  from 'common/helpers/mediaquery';

import { routes } from './routes';

let curWidth    = window.innerWidth;
let minWidth    = checkMediaQueryConfig(mediaQueryConfig)['desktop']['minWidth'];
let isDesktop   = curWidth >= minWidth;
let firstRender = true;

let render = () => {
    let curWidth = window.innerWidth;

    if (isDesktop === curWidth >= minWidth) {
        if (!firstRender) return;
    } else {
        isDesktop = !isDesktop;
    }

    if (isDesktop) {
        renderApp(routes, firstRender);
    }

    firstRender = false;

};

window.addEventListener('resize', render);

render();