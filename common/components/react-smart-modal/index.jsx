import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';
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

        window.addEventListener('keydown', this.onKeyDown, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown, true);

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

        if (isOpen) {
            this.mountChildrenBody();
        } else {
            this.unmountChildrenBody();
        }
    }

    mountChildrenBody() {
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

    onKeyDown = (event) => {
        if (event.keyCode === 27) { // 27 - ESC_CODE
            event.preventDefault();

            this.closeModal();
        }
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

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.setState({
            items: [{ key: 'modal', style: { y: 10, opacity: 0 } }]
        });

        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    componentWillUnmount() {
        this.setState({
            items: []
        });

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

    willLeave() {
        console.log('willLeave');
        return { y: spring(0), opacity: spring(0) };
    }

    willEnter() {
        console.log('willEnter');

        return { y: spring(50), opacity: spring(1) };
    }

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

                    <TransitionMotion
                        willLeave={this.willLeave}
                        willEnter={this.willEnter}
                        styles={this.state.items}
                    >

                        {interpolatedStyles =>
                            // first render: a, b, c. Second: still a, b, c! Only last one's a, b.
                            <div>
                                {interpolatedStyles.map(config => {
                                    console.log(config);

                                    return <div
                                        key={config.key}
                                        style={{
                                            ...config.style,
                                            border: '1px solid',
                                            height: '100px',
                                            width : '100px'
                                        }}/>;
                                })}
                            </div>
                        }

                    </TransitionMotion>
                    {/*{this.props.children}*/}

                </div>
            </div>
        );
    }
}