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

### methods
* openModal: manual open, example: by ref
* closeModal: manual close, example: by ref

Also component listen keyboard events to close them or open if shortcut combination is setgithub
