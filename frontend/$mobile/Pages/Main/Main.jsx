import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import Helmet               from 'react-helmet';

import globalStore          from 'common/modules/globalStore';

import locale               from 'frontend/modules/localization';

import ReactSmartModal      from 'common/components/react-smart-modal';

const _ = locale.get.bind(locale, require('./Main.json'));

@CSSModules(require('./Main.scss'))
export default class Main extends Component {
    constructor(props) {
        super(props);

        let { Template, Main } = globalStore.take('preloadStates') || {};
        let { products }       = Template || {};
        let { mainArticles }   = Main || {};

        this.state = {
            products:     products,
            mainArticles: mainArticles
        };
    }

    render() {
        return (
            <div styleName="page-main">
                <Helmet titleTemplate={`${_('company_name')} - %s`}
                        title={_('page_main')}/>

                <ReactSmartModal open={true}>
                    test
                </ReactSmartModal>
            </div>
        );
    }
}