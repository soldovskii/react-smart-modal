import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom/lib/ReactMount';

@CSSModules(require('./styles.scss'))
export default class ReactSmartModal extends Component {
    static propTypes = {
        open   : PropTypes.bool.isRequired,
        onOpen : PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        open: false
    };

    constructor(props) {
        super(props);

        this.currentState = null;
    }

    componentDidMount() {
        this.renderChildren(this.props.open);
    }

    componentWillUnmount() {
        this.renderChildren();
    }

    componentWillReceiveProps(nextProps) {
        this.renderChildren(nextProps.open);
    }

    renderChildren(isOpen) {
        if (this.currentState === isOpen) {
            return;
        } else {
            this.currentState = isOpen;
        }

        console.log('--------------');
        console.log('renderChildren');

        if (isOpen) {
            this.mountChildrenBody();
        } else {
            this.unmountChildrenBody();
        }
    }

    mountChildrenBody() {
        console.log('mountChildrenBody');

        this.modalContainer           = document.createElement('div');
        this.modalContainer.className = 'react-smart-modal';

        document.body.appendChild(this.modalContainer);
        document.body.classList.add('react-smart-modal--open');

        renderSubtreeIntoContainer(
            this,
            <ReactSmartModalBody
                {...this.props}
                closeModal={this.closeModal}
            />,
            this.modalContainer);
    }

    unmountChildrenBody() {
        console.log('unmountChildrenBody');

        if (this.modalContainer) {
            document.body.classList.remove('react-smart-modal--open');

            document.body.removeChild(this.modalContainer);

            unmountComponentAtNode(this.modalContainer);

            delete this.modalContainer;
        }
    }

    openModal = () => {
        this.renderChildren(true);
    };

    closeModal = () => {
        this.renderChildren(false);
    };

    render() {
        return null;
    }
}

@CSSModules(require('./styles.scss'))
class ReactSmartModalBody extends Component {
    static propTypes = {
        closeModal: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown, true);

        console.log('componentDidMount');

        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown, true);

        console.log('componentWillUnmount');

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    callCloseModal() {
        this.props.closeModal();
    }

    onCloseButtonClick = (event) => {
        event.stopPropagation();

        this.callCloseModal();
    };

    onOverlayClick = (event) => {
        event.stopPropagation();

        this.callCloseModal();
    };

    onBodyClick = (event) => {
        event.stopPropagation();
    };

    onKeyDown = (event) => {
        if (event.keyCode === 27) { // 27 - ESC_CODE
            event.preventDefault();

            this.callCloseModal(event);
        }
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