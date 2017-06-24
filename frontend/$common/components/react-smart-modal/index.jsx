/**
 * Modal not rendered inplace. Modal render to end of the body.
 */

import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';
import { renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom/lib/ReactMount';

/**
 * Container component. Represent API for use it:
 * props: {
 *  open: the flag is open or close modal
 *  onOpen: callback - call after modal opened
 *  onClose: callback - call after modal closed
 *  shortcut: keyCode for open modal if Control is pressed
 * }
 *
 * openModal: manual open, example: by ref
 * closeModal: manual close, example: by ref
 *
 * Also component listen keyboard events to close them or open if shortcut combination is set
 */
@CSSModules(require('./styles.scss'))
export default class ReactSmartModal extends Component {
    static propTypes = {
        open    : PropTypes.bool.isRequired,
        onOpen  : PropTypes.func,
        onClose : PropTypes.func,
        shortcut: PropTypes.string,
        modalID : PropTypes.string
    };

    static defaultProps = {
        open: false
    };

    constructor(props) {
        super(props);

        this.currentState = this.props.open;
    }

    componentDidMount() {
        if (this.props.open) {
            this.openModal();
        } else {
            this.closeModal();
        }

        window.addEventListener('keydown', this.onKeyPress, true);
        window.addEventListener('hashchange', this.checkHash, false);

        this.checkHash();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyPress, true);
        window.removeEventListener('hashchange', this.checkHash, false);

        this.closeModal();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            this.openModal();
        } else {
            this.closeModal();
        }
    }

    renderChildren(isOpen) {
        if (this.currentState === isOpen) {
            return;
        } else {
            this.currentState = isOpen;
        }

        if (isOpen) {
            this.setHash();

            this.mountChildrenBody();
        } else {
            this.clearHash();

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
            <ReactSmartModalContainer
                {...this.props}
                ref={(modal) => this.modal = modal}
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

    closeModal = (immediateClose = false) => {
        if (immediateClose) {
            this.renderChildren(false);
        } else {
            if (this.modal) this.modal.requestCloseModal();
        }
    };

    onKeyPress = (event) => {
        let { shortcut } = this.props;
        if (shortcut) {
            let key = 'Key' + shortcut.toUpperCase();

            if (event.code === key && event.ctrlKey) {
                event.preventDefault();

                this.openModal();
            }
        }
    };

    checkHash = () => {
        let { modalID } = this.props;

        if (modalID && location.hash === '#' + modalID) {
            this.openModal();
        } else {
            this.closeModal();
        }
    };

    clearHash = () => {
        let { modalID } = this.props;

        if (modalID && location.hash === '#' + modalID) {
            //location.hash = '';

            // Use history because after set empty string to location.hash hash will stay in url
            history.pushState('', document.title, window.location.pathname);
        }
    };

    setHash = () => {
        let { modalID } = this.props;

        if (modalID && location.hash !== '#' + modalID) {
            history.pushState('', document.title, window.location.pathname + '#' + modalID);
        }
    };

    render() {
        return null;
    }
}

/**
 * Component Controller. Animation wrapper of ReactSmartModalBody
 * Controls the display of modal. Listen events for send closeRequest to ReactSmartModal
 */
@CSSModules(require('./styles.scss'))
class ReactSmartModalContainer extends Component {
    static propTypes = {
        closeModal: PropTypes.func.isRequired,
        onClose   : PropTypes.func,
        onOpen    : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.setState({
            items: [{ key: 'modal', opacity: 1, translateY: 0 }]
        });

        window.addEventListener('keydown', this.onKeyDown, true);

        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown, true);

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    requestCloseModal() {
        this.setState({
            items: []
        });
    }

    onCloseButtonClick = (event) => {
        event.stopPropagation();

        this.requestCloseModal();
    };

    onOverlayClick = (event) => {
        event.stopPropagation();

        this.requestCloseModal();
    };

    onBodyClick = (event) => {
        event.stopPropagation();
    };

    onKeyDown = (event) => {
        if (event.keyCode === 27) { // 27 - ESC_CODE
            event.preventDefault();

            this.requestCloseModal();
        }
    };

    render() {
        return (
            <TransitionMotion
                willLeave={() => ({
                    opacity   : spring(0, { stiffness: 270, damping: 30, precision: 2 }),
                    translateY: spring(-200, { stiffness: 280, damping: 30, precision: 400 })
                })}
                willEnter={() => ({
                    opacity   : 0,
                    translateY: -200
                })}
                styles={this.state.items.map(item => ({
                    key  : item.key,
                    style: {
                        opacity   : spring(item.opacity, { stiffness: 270, damping: 30, precision: 0.01 }),
                        translateY: spring(item.translateY, { stiffness: 270, damping: 30, precision: 2 })
                    }
                }))}
            >

                {interpolatedStyles =>
                    <div>
                        {interpolatedStyles.map(config => {
                            return (
                                <ReactSmartModalBody
                                    key={config.key}
                                    style={{
                                        opacity  : config.style.opacity,
                                        transform: `translate(-50%, ${config.style.translateY}%)`
                                    }}
                                    onCloseButtonClick={this.onCloseButtonClick}
                                    onOverlayClick={this.onOverlayClick}
                                    onBodyClick={this.onBodyClick}
                                    {...this.props}
                                >
                                    {this.props.children}
                                </ReactSmartModalBody>
                            );
                        })}
                    </div>
                }
            </TransitionMotion>
        );
    }
}

/**
 * Represent component. Body of modal.
 * Needed because TransitionMotion is't have callback on willLeave complete
 */
@CSSModules(require('./styles.scss'))
class ReactSmartModalBody extends Component {
    static propTypes = {
        onCloseButtonClick: PropTypes.func.isRequired,
        onOverlayClick    : PropTypes.func.isRequired,
        onBodyClick       : PropTypes.func.isRequired,
        closeModal        : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        setTimeout(this.props.closeModal.bind(this, true), 0);
    }

    render() {
        return (
            <div styleName='react-smart-modal-container'>
                <div styleName='react-smart-modal-overlay'
                     style={{ opacity: this.props.style.opacity }}
                     onClick={this.props.onOverlayClick}
                ></div>
                <div
                    styleName='react-smart-modal-body'
                    style={{ transform: this.props.style.transform }}
                    onClick={this.props.onBodyClick}
                >
                    <div
                        styleName='react-smart-modal-body__close-button'
                        onClick={this.props.onCloseButtonClick}
                    >
                        &#x2716;
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}