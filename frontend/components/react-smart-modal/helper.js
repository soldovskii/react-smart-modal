function getScrollWidth() {
    let windowWidth = window.innerWidth;
    let bodyWidth   = document.body.clientWidth;
    let scrollWidth = windowWidth - bodyWidth;

    return scrollWidth;
}

function toggleModal(action) {
    if (action === 'add') {
        let scrollWidth = getScrollWidth();
        if (scrollWidth > 0) {
            document.body.style.marginRight = scrollWidth + 'px';
        }
    }

    if (action === 'remove') {
        document.body.style.marginRight = '';
    }
}

export class ModalHelper {
    static openModal() {
        toggleModal('add');
    }

    static closeModal() {
        toggleModal('remove');
    }
}