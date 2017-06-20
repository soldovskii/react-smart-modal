import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom/lib/ReactMount';

@CSSModules(require('./styles.scss'))
export default class ReactSmartModal extends Component {
    static propTypes = {
        open   : PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        onOpen : PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.renderChildren(this.props);

        window.addEventListener('keydown', this.onKeyDown, true);
    }

    componentWillUnmount() {
        this.renderChildren(Object.assign({}, this.props, { open: false }));

        window.removeEventListener('keydown', this.onKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        this.renderChildren(nextProps);
    }

    renderChildren(props) {
        if (props.open) {
            this.mountChildrenBody(props);
        } else {
            this.unmountChildrenBody(props);
        }
    }

    mountChildrenBody(props) {
        this.modal           = document.createElement('div');
        this.modal.className = 'react-smart-modal';

        document.body.appendChild(this.modal);
        document.body.classList.add('react-smart-modal--open');

        renderSubtreeIntoContainer(this, <ReactSmartModalBody {...props} />, this.modal);
    }

    unmountChildrenBody(props) {
        if (this.modal) {
            document.body.classList.remove(props.bodyOpenClassName);
            document.body.removeChild(this.modal);

            unmountComponentAtNode(this.modal);

            delete this.modal;
        }
    }

    onKeyDown = () => {
        if (event.keyCode === 27) { // 27 - ESC_CODE
            event.preventDefault();

            this.props.onClose(event);
        }
    };

    render() {
        return null;
    }
}

@CSSModules(require('./styles.scss'))
class ReactSmartModalBody extends Component {
    constructor(props) {
        super(props);

        // Флаг, означающий нужно ли размонитровать модальное окно
        // Используется, чтобы не обращаться к DOM
        this.needUnmount = null;
    }

    componentDidMount() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    callOnClose(event) {
        this.props.onClose(event);
    }

    // Клике на фон модального окна
    onOverlayClick = (event) => {
        if (this.needUnmount === null) {
            this.needUnmount = true;
        }

        if (this.needUnmount === true) {
            this.callOnClose(event);
        }

        this.needUnmount = null;
    };

    // Клике на теле модального окна
    onBodyClick = (event) => {
        this.needUnmount = false;
    };

    onCloseButtonClick = (event) => {
        this.callOnClose(event);
    };

    render() {
        return (
            <div
                styleName='react-smart-modal-overlay'
                onClick={this.onOverlayClick}
            >
                <div
                    styleName='react-smart-modal-body'
                    onClick={this.onBodyClick}
                >
                    <div
                        styleName='react-smart-modal-body__close-button'
                        onClick={this.onCloseButtonClick}
                    >&#x2716;</div>

                    {this.props.children}

                </div>
            </div>
        );
    }
}