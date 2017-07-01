import 'normalize.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'frontend/css/form.scss';
import 'frontend/css/elements.scss';

import React, { Component } from 'react';

import { browserHistory } from 'react-router';
import Helmet             from 'react-helmet';

import fetchData  from 'common/modules/@fetchData';
import locale     from 'frontend/modules/localization';
import globalLoc  from '../localization.json';

const _ = locale.set(globalLoc);

//let requestRules = [
//    { 'products': 'product/getList' }
//];
//@fetchData(requestRules)
export default class Template extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        let { children } = this.props;

        return (
            <div className="app">
                { children }
            </div>
        );
    }
}
