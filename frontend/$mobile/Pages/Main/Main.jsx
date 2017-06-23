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
            products    : products,
            mainArticles: mainArticles,
            modalIsOpen : false
        };
    }

    render() {
        let { modalIsOpen } = this.state;

        return (
            <div styleName="page-main">
                <Helmet titleTemplate={`${_('company_name')} - %s`} title={_('page_main')}/>

                <div className="plain_button" onClick={() => this.setState({ modalIsOpen: true })}>click me</div>

                <p>
                    Что такое Lorem Ipsum?
                    Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров
                    и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация
                    листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.

                    Почему он используется?
                    Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и
                    пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию,
                    так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много версий. Некоторые версии появились по ошибке,
                    некоторые - намеренно (например, юмористические варианты).
                </p>

                <ReactSmartModal
                    open={modalIsOpen}
                    onOpen={() => {
                        console.log('onOpen');
                    }}
                    onClose={() => {
                        console.log('onClose');
                    }}
                >
                    <p style={{ width: '80vw' }}>
                        Где его взять?
                        Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, юмористические вставки или слова, которые даже отдалённо не напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного
                        проекта, вы наверняка не хотите какой-нибудь шутки, скрытой в середине абзаца. Также все другие известные генераторы Lorem Ipsum используют один и тот же текст, который они просто повторяют, пока не достигнут нужный объём. Это
                        делает предлагаемый здесь генератор единственным настоящим Lorem Ipsum генератором. Он использует словарь из более чем 200 латинских слов, а также набор моделей предложений. В результате сгенерированный Lorem Ipsum выглядит
                        правдоподобно, не имеет повторяющихся абзацей или "невозможных" слов.
                    </p>
                </ReactSmartModal>
            </div>
        );
    }
}