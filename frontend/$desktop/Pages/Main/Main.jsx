import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import Helmet from 'react-helmet';

import globalStore from 'common/modules/globalStore';

import locale from 'frontend/modules/localization';

import ReactSmartModal from 'common/components/react-smart-modal';

const _ = locale.get.bind(locale, require('./Main.json'));

@CSSModules(require('./Main.scss'))
export default class Main extends Component {
    constructor(props) {
        super(props);

        let { Template, Main } = globalStore.take('preloadStates') || {};
        let { products }       = Template || {};
        let { mainArticles }   = Main || {};

        this.state = {
            products    : products,
            mainArticles: mainArticles,
            modalIsOpen : true
        };
    }

    render() {
        let { modalIsOpen } = this.state;

        return (
            <div styleName="page-main">
                <Helmet titleTemplate={`${_('company_name')} - %s`}
                        title={_('page_main')}/>

                <div onClick={() => this.setState({ modalIsOpen: !modalIsOpen })}>click me</div>

                <ReactSmartModal open={modalIsOpen}>
                    <form className="extra-form">
                        <h2> Login Form </h2>
                        <div className="input-container">
                            <label htmlFor="login">Login</label>
                            <input id="login" type="text"/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password"/>
                        </div>

                        <div className="button-container">
                            <button type="submit">LOGIN</button>
                        </div>
                    </form>
                </ReactSmartModal>
            </div>
        );
    }
}