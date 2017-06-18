/**
 * Created by soldovkij on 16.06.17.
 */

import React, { Component } from 'react';
import globalStore          from 'common/modules/globalStore';

export default function fetchData(fetchRules) {
    return function (Target) {
        return class FetchWrapper extends Component {
            static fetchComponentName = `${Target.name}`;

            static originalComponent = Target;

            static getFetchRules = () => fetchRules;

            constructor(props) {
                super(props);

                let preloadStates = globalStore.take('preloadStates');
                let componentName = FetchWrapper.fetchComponentName;
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