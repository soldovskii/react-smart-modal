import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import Helmet               from 'react-helmet';

import globalStore          from 'common/modules/globalStore';
import fetchData            from 'frontend/modules/@fetchData';

import locale               from 'frontend/modules/localization';

import APIComponent         from 'frontend/APIComponent';

const _ = locale.get.bind(locale);

let requestRules = [
    { 'mainNews': 'news/main' }
];
@fetchData(requestRules)
@CSSModules(require('./Main.scss'))
export default class Main extends APIComponent {
    constructor(props) {
        super(props, requestRules, true, true);

        let { Template, Main } = globalStore.take('preloadStates') || {};
        let { products }       = Template || {};
        let { mainNews }       = Main || {};

        this.state = {
            products: products,
            mainNews: mainNews
        };
    }

    render() {
        let { products, mainNews } = this.state;

        return (
            <div styleName="page-main">
                <Helmet titleTemplate={`${_('company_name')} - %s`}
                        title='главная'/>

                Desktop news

                {
                    mainNews && mainNews.map(n => <div key={`n_id-${n.id}`}>{ n.name }</div>)
                }
            </div>
        );
    }
}