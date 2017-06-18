/**
 * Created by soldovskij on 07.06.17.
 */

import React                           from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Template               from '../$template';
import MainPage               from './Pages/Main/Main';

export const routes = (
    <Route path='/(:city)' component={ Template }>
        <IndexRoute component={ MainPage }/>

        // don`t touch pls, must always be the lowest
        {/*<Route path="*" component={ ErrorPage }/>*/}
    </Route>
);