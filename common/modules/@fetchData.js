/**
 * Created by soldovkij on 16.06.17.
 */

import React, { Component } from 'react';
import globalStore          from 'common/modules/appData';

export default function fetchData(fetchRules) {
    return function (Target) {
        return class FetchWrapper extends Component {

            static fetchComponentName = Target.displayName || Target.name;

            static getFetchRules = () => fetchRules;

            constructor(props) {
                super(props);

                let preloadStates = globalStore.take('preloadStates') || {};
                let componentName = Target.displayName || Target.name;
                let stateObject   = {};

                fetchRules.forEach(fetchItem => {
                    let propName = Object.keys(fetchItem)[0];

                    if (preloadStates && preloadStates[componentName]) {
                        stateObject[propName] = preloadStates[componentName][propName];
                    }
                });

                this.state = stateObject;
            }

            render() {
                let props = Object.assign({}, this.props, this.state);
                return <Target {...props}/>;
            }

        };

    };
}