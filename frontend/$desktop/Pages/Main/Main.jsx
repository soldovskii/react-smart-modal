import CSSModules from 'react-css-modules';

import React, { Component } from 'react';
import Helmet from 'react-helmet';

import globalStore from 'common/modules/globalStore';

import locale from 'frontend/modules/localization';

import ReactSmartModal from 'frontend/$common/components/react-smart-modal';

const _ = locale.get.bind(locale, require('./Main.json'));

@CSSModules(require('./Main.scss'))
export default class Main extends Component {
    constructor(props) {
        super(props);

        let { Template, Main } = globalStore.take('preloadStates') || {};
        let { products }       = Template || {};
        let { mainArticles }   = Main || {};

        this.state = {
            products        : products,
            mainArticles    : mainArticles,
            loginModalIsOpen: false,
            alertModalIsOpen: false
        };
    }

    render() {
        let { loginModalIsOpen, alertModalIsOpen } = this.state;

        return (
            <div styleName="page-main">
                <Helmet titleTemplate={`${_('company_name')} - %s`} title={_('page_main')}/>

                <div className="plain_button" onClick={() => this.setState({ loginModalIsOpen: true })}>click me</div>

                <p>
                    Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем так.
                    Его корни уходят в один фрагмент классической латыни 45 года н.э., то есть более двух тысячелетий
                    назад. Ричард МакКлинток,
                    профессор латыни из колледжа Hampden-Sydney, штат Вирджиния, взял одно из самых странных слов в
                    Lorem Ipsum, "consectetur", и занялся его поисками в классической латинской литературе. В результате
                    он нашёл неоспоримый
                    первоисточник Lorem Ipsum в разделах 1.10.32 и 1.10.33 книги "de Finibus Bonorum et Malorum" ("О
                    пределах добра и зла"), написанной Цицероном в 45 году н.э. Этот трактат по теории этики был очень
                    популярен в эпоху Возрождения.
                    Первая строка Lorem Ipsum, "Lorem ipsum dolor sit amet..", происходит от одной из строк в разделе
                    1.10.32

                    Классический текст Lorem Ipsum, используемый с XVI века, приведён ниже. Также даны разделы 1.10.32 и
                    1.10.33 "de Finibus Bonorum et Malorum" Цицерона и их английский перевод, сделанный H. Rackham, 1914
                    год.
                </p>

                <ReactSmartModal
                    open={loginModalIsOpen}
                    onOpen={() => {
                        console.log('onOpen');
                    }}
                    onClose={() => {
                        console.log('onClose');
                        this.setState({ loginModalIsOpen: false });
                    }}
                    shortcut='g'
                    modalID='login'
                    isAnimated={true}
                >
                    <form className="extra-form login-form"
                          onSubmit={(event) => event.preventDefault()}
                    >
                        <h2> Login Form </h2>
                        <div className="input-container">
                            <label htmlFor="login">Login</label>
                            <input id="login" type="text"/>
                        </div>

                        <div className="input-container">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password"/>
                        </div>

                        <div className="button-container">
                            <button type="submit" onClick={() => this.setState({ alertModalIsOpen: true })}>LOGIN</button>
                        </div>
                    </form>
                </ReactSmartModal>

                <ReactSmartModal
                    open={alertModalIsOpen}
                    onOpen={() => {
                        console.log('onOpen');
                    }}
                    onClose={() => {
                        console.log('onClose');
                        this.setState({ alertModalIsOpen: false });
                    }}
                    isAnimated={true}
                >
                    <form className="extra-form" onSubmit={(event) => event.preventDefault()}>
                        <h1>Такой пользователь не существует</h1>
                        <div className="button-container">
                            <button type="submit" onClick={() => this.setState({ alertModalIsOpen: false })}>CLOSE</button>
                        </div>
                    </form>
                </ReactSmartModal>
            </div>
        );
    }
}