import React, { Component } from 'react';
import { clientFetch }      from 'frontend/modules/clientFetch';
import axios from 'axios';

/**
 *
 */
export default class APIComponent extends Component {
    constructor(props, requestRules, force, chunkCache) {
        super(props);

        this.__requestRules  = requestRules;
        this.__chunkCache = chunkCache;
        this.__force = force;
    }

    componentDidMount() {
        let { params, session } = this.props;

        if (this.__requestRules) {
            this.loadAPIData(params, session, this.__requestRules);
        }
    }

    /**
     * Загружает по указанным правилам данные и устанавливает их в state компонента
     * @param params параметры устаналиваемые ReactRouter, содержит значения переменных роутинга
     * @param session объект сессии, содержит элемент корзины и прочие сессионные данные
     * @param requestRules массив правил, которые содержат правила запроса
     * @param [callback] если указана функция, то будет вызвана она, вместо вызова setState
     */
    loadAPIData(params, session, requestRules, callback) {
        let completeProps = Object.assign({}, params, session);

        let componentName = this.constructor.displayName || this.constructor.name;

        if (requestRules.length > 0) {
            clientFetch(axios, requestRules, completeProps,
                (preloadState) => {
                    if (typeof callback === 'function') {
                        callback(preloadState);
                    } else {
                        this.setState(preloadState);
                    }
                },
                (error) => {
                    console.error(error);
                },
                componentName, this.__force, this.__chunkCache
            );
        }
    }
}