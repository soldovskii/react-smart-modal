# react-smart-modal
This is my react-app architecture with related component

Component located at [react-smart-modal/frontend/$common/components/react-smart-modal](https://github.com/soldovskij/react-smart-modal/tree/master/frontend/%24common/components/react-smart-modal)

[Demo on heroku](https://react-smart-modal.herokuapp.com/)

### props
* isAnimated: if true modal close and open precess will animated
* open: the flag is open or close modal, default true
* onOpen: callback - call after modal opened
* onClose: callback - call after modal closed
* shortcut: keyCode for open modal if Control is pressed
* modalID: used for hash in URL. **If set need onOpen callback to synchronize open { true|false } state in parent component**

### methods
* openModal: manual open, example: by ref
* closeModal: manual close, example: by ref

Also component listen keyboard events to close them or open if shortcut combination is setgithub

### example

```javascript
export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false
        };
    }

    render() {
        let { loginModalIsOpen } = this.state;

        return(
            <div styleName="page-main">
              <button onClick={() => this.setState({ modalIsOpen: true })}>click me</button>
              
              <ReactSmartModal
                  open={loginModalIsOpen}
                  onOpen={() => this.setState({ modalIsOpen: true })};
                  onClose={() => this.setState({ modalIsOpen: false })};
                  shortcut='g'
                  modalID='login'
                  isAnimated={true}
              >
            </div>
        );
    }
}
```
