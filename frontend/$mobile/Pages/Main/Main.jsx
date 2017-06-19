import CSSModules from 'react-css-modules';
import './Main.scss';

import React, { Component } from 'react';
import Helmet               from 'react-helmet';

import globalStore          from 'common/modules/globalStore';
import fetchData            from 'common/modules/@fetchData';

import locale               from 'frontend/modules/localization';

import APIComponent         from 'frontend/APIComponent';

const _ = locale.get.bind(locale, require('./Main.json'));

let requestRules = [
    { 'mainArticles': 'articles/main' }
];
@fetchData(requestRules)
@CSSModules(require('./Main.scss'))
export default class Main extends APIComponent {
    constructor(props) {
        super(props, requestRules, true, false);

        let { Template, Main } = globalStore.take('preloadStates') || {};
        let { products }       = Template || {};
        let { mainArticles }   = Main || {};

        this.state = {
            products:     products,
            mainArticles: mainArticles
        };
    }

    render() {
        let { products, mainArticles } = this.state;

        return (
            <div styleName="page-main">
                <Helmet titleTemplate={`${_('company_name')} - %s`}
                        title='главная'/>

                {_('mobile-articles')}

                {
                    mainArticles && mainArticles.map(n => <div key={`n_id-${n.id}`}>{ n.title }</div>)
                }
            </div>
        );
    }
}