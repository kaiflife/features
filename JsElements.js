const setStyleToEl = (style, el) => {
    if (style && el) {
        Object.keys(style).forEach(styleKey => {
            el.style[styleKey] = style[styleKey]
        })
    }
}

class CustomSelector {
    constructor({ id = '', options = [], label = '', height = '300px', isMulti = true }) {
        this.id = id;
        this.options = options;
        this.label = label;
        this.height = height;
        this.isMulti = isMulti;
        this.optionSelectedClassQuery = 'option-selected';

        this.containerEl = document.createElement('div');
        this.optionsContainerEl = document.createElement('ul');
        this.labelEl = document.createElement('span');

        this.init();
    }

    getOptionString({ isSelected, id, name }) {
        return `<li class="${isSelected ? this.optionSelectedClassQuery : ''}" value="${id}">${name}</li>`;
    }

    setSelectorOptions(options = []) {
        this.optionsContainerEl.innerHTML = options.reduce((newStringHtml, { name, id }) => {
            newStringHtml += this.getOptionString({ isSelected: false, id, name });
            return newStringHtml;
        }, '');
    }

    init() {
        this.labelEl.innerHTML = this.label
        this.containerEl.append(this.labelEl);

        this.setSelectorOptions(this.options);

        this.containerEl.id = 'sendMessageSelector';
        this.containerEl.classList.add('custom-selector');

        setStyleToEl({
            display: 'flex',
            'flex-direction': 'column',
            gap: '4px',
        }, this.containerEl)

        setStyleToEl({
            height: this.height,
            width: '100%',
            display: 'flex',
            'flex-direction': 'column',
            gap: '8px',
            padding: '8px',
            overflow: 'auto',
            border: '1px solid black',
            'border-radius': '4px',
        }, this.optionsContainerEl)

        this.optionsContainerEl.onclick = (event) => {
            if (event.target.tagName === 'LI') {
                if (event.target.classList.contains(this.optionSelectedClassQuery)) {
                    event.target.classList.remove(this.optionSelectedClassQuery);
                } else {
                    if (!this.isMulti) {
                        this.selector.querySelector(`.${this.optionSelectedClassQuery}`)?.classList.remove(this.optionSelectedClassQuery);
                    }
                    event.target.classList.add(this.optionSelectedClassQuery);
                }
            }
        };

        this.containerEl.append(this.optionsContainerEl)
    }

    getElement() {
        return this.containerEl;
    }
}

class CustomTextarea {
    constructor({ id = '', value = '', label = 'Введите текст сообщения', rows = 4, containerClassName = '', className = '', style, containerStyle }) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.rows = rows;
        this.className = className;
        this.containerClassName = containerClassName;
        this.style = style;
        this.containerStyle = containerStyle;

        this.containerEl = document.createElement('div');
        this.inputEl= document.createElement('textarea');
        this.labelEl = document.createElement('span');

        this.init();
    }

    init() {
        this.containerEl.className = this.containerClassName;
        setStyleToEl({ display: 'flex', 'flex-direction': 'column', gap: '4px'}, this.containerEl)

        this.labelEl.innerHTML = this.label
        this.containerEl.append(this.labelEl);

        this.inputEl.rows = this.rows;
        this.inputEl.classList.add('textarea');
        this.inputEl.className = this.className;
        setStyleToEl(this.style, this.inputEl)

        this.containerEl.append(this.inputEl)

        if (this.id) {
            this.containerEl.id = this.id;
        }

        setStyleToEl(this.style, this.containerEl);
    }

    getElement() {
        return this.containerEl;
    }
}

class CustomModal {
    constructor(options = {}) {
        this.settings = {
            title: 'Заголовок модального окна',
            content: '',
            id: 'modalId',
            buttons: [],
            height: 'fit-content',
            width: 'fit-content',
            onClose: null,
            closeOnEsc: true,
            closeOnOverlay: true,
            ...options
        };

        this.modalContainerEl = this.createModalContainerEl();
        this.headerEl = this.createHeaderEl();
        this.mainEl = this.createMainEl();
        this.footerEl = this.createFooterEl();
        this.modalEl = this.createModalEl();

        this.initEvents();
        this.render();
    }

    createModalContainerEl() {
        const containerEl = document.createElement('div');
        containerEl.id = this.settings.id;
        containerEl.className = 'custom-modal';

        const styles = {
            width: '100vw',
            height: '100vh',
            zIndex: '3',
            position: 'fixed',
            top: '0',
            left: '0',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };

        setStyleToEl(styles, containerEl)

        return containerEl;
    }

    createHeaderEl() {
        const headerEl = document.createElement('div');
        headerEl.classList.add('header');
        setStyleToEl({ 'padding-right': '56px', position: 'relative', 'min-height': '38px' }, headerEl);


        const title = document.createElement('h3');
        title.textContent = this.settings.title;

        this.closeButtonEl = document.createElement('button');
        this.closeButtonEl.classList.add('close');
        this.closeButtonEl.textContent = '×';

        const buttonStyles = {
            position: 'absolute',
            width: '38px',
            height: '38px',
            top: '-8px',
            right: '0'
        };

        setStyleToEl(buttonStyles, this.closeButtonEl)

        headerEl.append(title, this.closeButtonEl);

        return headerEl;
    }

    createMainEl() {
        const mainEl = document.createElement('div');
        mainEl.classList.add('main');

        const styles = {
            display: 'flex',
            flexDirection: 'column',
            height: '0',
            gap: '8px',
            overflow: 'auto',
            flex: '1'
        };

        setStyleToEl(styles, mainEl)

        if (typeof this.settings.content === 'string') {
            mainEl.innerHTML = this.settings.content;
        } else {
            mainEl.append(this.settings.content);
        }

        return mainEl;
    }

    createFooterEl() {
        const footerEl = document.createElement('div');
        footerEl.classList.add('footer');

        this.settings.buttons.forEach(button => {
            const btnEl = document.createElement('button');
            btnEl.classList.add('button');
            btnEl.textContent = button.text;
            btnEl.onclick = button.onClick;
            footerEl.append(btnEl);
        });

        return footerEl;
    }

    createModalEl() {
        const modalEl = document.createElement('div');

        setStyleToEl({
            padding: '14px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: this.settings.width,
            height: this.settings.height,
            'max-height': '100vh',
        }, modalEl)

        return modalEl;
    }

    initEvents() {
        this.closeOnEscButton = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        };

        this.closeModal = () => {
            if (this.settings.onClose) {
                const shouldStopCloseModal = this.settings.onClose();
                if (shouldStopCloseModal) {
                    return;
                }
            }

            this.destroy();
        };

        this.closeButtonEl.addEventListener('click', this.closeModal);

        if (this.settings.closeOnEsc) {
            document.addEventListener('keydown', this.closeOnEscButton);
        }

        if (this.settings.closeOnOverlay) {
            this.modalContainerEl.addEventListener('click', (e) => {
                if (e.target === this.modalContainerEl) {
                    this.closeModal();
                }
            });
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.closeOnEscButton);
        this.modalContainerEl.removeEventListener('click', this.closeOnOverlay);
        this.closeButtonEl.removeEventListener('click', this.closeModal);
        this.modalContainerEl.remove();
    }

    render() {
        this.modalEl.append(this.headerEl, this.mainEl, this.footerEl);
        this.modalContainerEl.append(this.modalEl);
        document.body.append(this.modalContainerEl);
    }

    close() {
        this.closeModal();
    }
}

// Пример использования:
// const modal = new CustomModal({
//     title: 'Мой заголовок',
//     content: '<p>Содержимое модального окна</p>',
//     buttons: [
//         {
//             text: 'Закрыть',
//             onClick: () => modal.close()
//         }
//     ]
// });
