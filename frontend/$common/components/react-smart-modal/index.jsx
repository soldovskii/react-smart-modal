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
export default class ReactSmartModal extends Component {
    static propTypes = {
        open      : PropTypes.bool,
        onOpen    : PropTypes.func,
        onClose   : PropTypes.func,
        shortcut  : PropTypes.string,
        modalID   : PropTypes.string,
        isAnimated: PropTypes.bool
    };

    static defaultProps = {
        open      : false,
        isAnimated: false
    };

    static modalList = [];

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

        window.addEventListener('keydown', this.onKeyDown, true);
        window.addEventListener('hashchange', this.checkHash, false);

        this.checkHash();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown, true);
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
            this.mountChildrenBody();

            this.setHash();
        } else {
            this.unmountChildrenBody();

            this.clearHash();
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
                ref={this.addToCollector}
                closeModal={this.closeModal}
            />,
            this.modalContainer);
    }

    unmountChildrenBody() {
        if (this.modalContainer) {
            this.delFromCollector();

            unmountComponentAtNode(this.modalContainer);

            document.body.classList.remove('react-smart-modal--open');
            document.body.removeChild(this.modalContainer);

            delete this.modalContainer;
        }
    }

    addToCollector = (modal) => {
        if (modal) {
            this.modal = modal;
            ReactSmartModal.modalList.push(modal);
        }
    };

    delFromCollector = () => {
        if (this.modal) {
            delete this.modal;
            ReactSmartModal.modalList.pop();
        }
    };

    openModal = () => {
        this.renderChildren(true);
    };

    closeModal = () => {
        this.renderChildren(false);
    };

    onKeyDown = (event) => {
        let { shortcut } = this.props;
        let { modalList } = ReactSmartModal;

        if (shortcut) {
            let key = 'Key' + shortcut.toUpperCase();

            if (event.code === key && event.ctrlKey) {
                event.preventDefault();

                this.openModal();
            }
        }

        if (event.keyCode === 27) { // 27 - ESC_CODE
            event.preventDefault();

            if (this.modal === modalList[modalList.length - 1]) {
                this.modal.requestCloseModal();
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

    /**
     * This method will called when ReactSmartModal component mounted this component
     */
    componentDidMount() {
        this.setState({
            items: [{ key: 'modal', style: { opacity: 1, translateY: 0 } }]
        });

        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    /**
     * This method will called after ReactSmartModal component will unmount this component
     * For trigger that queue ReactSmartModalBody called closeModal on own componentWillUnmount
     */
    componentWillUnmount() {
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

    renderAsStatic() {
        let item = this.state.items[0];

        if (item) {
            return this.renderBody(item);
        } else {
            return null;
        }
    }

    renderAsAnimated() {
        let preset = { stiffness: 270, damping: 30 };

        return (
            <TransitionMotion
                willLeave={() => ({
                    opacity   : spring(0, { ...preset, precision: 2 }),
                    translateY: spring(-200, { ...preset, precision: 400 })
                })}
                willEnter={() => ({
                    opacity   : 0,
                    translateY: -200
                })}
                styles={this.state.items.map(item => ({
                    key  : item.key,
                    style: {
                        opacity   : spring(item.style.opacity, { ...preset, precision: 0.01 }),
                        translateY: spring(item.style.translateY, { ...preset, precision: 2 })
                    }
                }))}
            >

                {interpolatedStyles =>
                    <div>
                        {interpolatedStyles.map(config => this.renderBody(config))}
                    </div>
                }
            </TransitionMotion>
        );
    }

    renderBody(config) {
        return <ReactSmartModalBody
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
        </ReactSmartModalBody>;
    }

    render() {
        if (this.props.isAnimated) {
            return this.renderAsAnimated();
        } else {
            return this.renderAsStatic();
        }
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

    /**
     * This method will called after ReactMotion animation started.
     */
    componentDidMount() {

    }

    /**
     * This method will called after ReactMotion animation completed.
     * Then manual call closeModal on ReactSmartModal component for next modal lifecycle actions
     */
    componentWillUnmount() {
        setTimeout(this.props.closeModal, 0);
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