# react-smart-modal

This is my react-app architecture with related component

Component located at [react-smart-modal/frontend/$common/components/react-smart-modal](https://github.com/soldovskij/react-smart-modal/tree/master/frontend/%24common/components/react-smart-modal)

Demo on heroku [https://react-smart-modal.herokuapp.com/](https://react-smart-modal.herokuapp.com/)

### Props
| Key            | Description                                   | Default   | Required | Type   |
| :------------- |:----------------------------------------------------|----------:|---------:|--------:
| open           | the flag is open or close modal, default true       | false     |true      |bool    |
| onOpen         | callback - call after modal opened                  | -         | -        |func    |
| onClose        | callback - call after modal closed                  | -         | -        |func    |
| shortcut       | keyCode for open modal if Control is pressed        | -         | -        |string  |
| modalID        | used for hash in URL if set                         | -         | -        |string  |
| isAnimated     | if true modal close and open precess will animated | false     | -        |bool    |

### Important
> **If modalID or shorcut is set need onOpen callback** to synchronize open state { true|false } in parent component. Because modal can  be opened by set hash to URL or press shortcut. Resp. modal will be open, but parent component will stay with old state.

> Also component listen keyboard events to close them by press ESC or open if shortcut combination is set.

### Methods
* openModal: manual open, example: by ref
* closeModal: manual close, example: by ref



### Example

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
