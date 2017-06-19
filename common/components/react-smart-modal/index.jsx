import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

@CSSModules(require('./styles.scss'))
export default class ReactSmartModal extends Component {
    static propTypes = {
        modalClassName       : PropTypes.string,
        modalOverlayClassName: PropTypes.string,
        modalBodyClassName   : PropTypes.string,
        bodyOpenClassName    : PropTypes.string
    };

    static defaultProps = {
        open                 : false,
        modalClassName       : 'react-smart-modal',
        modalOverlayClassName: 'react-smart-modal-overlay',
        modalBodyClassName   : 'react-smart-modal-body',
        bodyOpenClassName    : 'react-smart-modal--open'
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    componentDidMount() {
        this.renderChildren(this.props);
    }

    componentWillUnmount() {
        this.renderChildren(Object.assign({}, this.props, { open: false }));
    }

    componentWillReceiveProps(nextProps) {
        this.renderChildren(nextProps);
    }

    componentWillUpdate() {

    }

    renderChildren(props) {
        if (props.open) {
            this.modal           = document.createElement('div');
            this.modal.className = this.props.modalClassName;

            document.body.appendChild(this.modal);
            document.body.classList.add(props.bodyOpenClassName);

            unstable_renderSubtreeIntoContainer(this, this.renderChildrenBody(props), this.modal);
        } else {
            document.body.classList.remove(props.bodyOpenClassName);
            document.body.removeChild(this.modal);

            unstable_renderSubtreeIntoContainer(this, this.renderChildrenEmpty(), this.modal);
        }
    }

    renderChildrenBody(props) {
        return ( <ReactSmartModalBody {...props} /> );
    }

    renderChildrenEmpty() {
        return ( <div></div> );
    }

    render() {
        return null;
    }
}

@CSSModules(require('./styles.scss'))
class ReactSmartModalBody extends Component {

    render() {
        return (
            <div styleName="react-smart-modal-overlay">
                <div styleName="react-smart-modal-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}