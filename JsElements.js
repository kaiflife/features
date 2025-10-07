const setStyleToEl = (style, el) => {
    Object.keys(style).forEach(styleKey => {
        el[styleKey] = style[styleKey]
    })
}

class CustomSelector {
        constructor({ id = '', options = [], label = '', height = '300px', isMulti = true }) {
            this.id = id;
            this.options = options;
            this.label = label;
            this.height = height;
            this.isMulti = isMulti;
            this.optionSelectedClassQuery = 'option-selected';

            this.selector = document.createElement('div');
            this.selectorList = document.createElement('ul');
            this.selectorLabel = document.createElement('span');

            this.init();
        }

        getOptionString({ isSelected, id, name }) {
            return `<li class="${isSelected ? this.optionSelectedClassQuery : ''}" value="${id}">${name}</li>`;
        }

        setSelectorOptions(options = []) {
            this.selectorList.innerHTML = options.reduce((newStringHtml, { name, id }) => {
                newStringHtml += this.getOptionString({ isSelected: false, id, name });
                return newStringHtml;
            }, '');
        }

        init() {
            this.selectorLabel.innerHTML = this.label
            this.selectorLabel.style['word-wrap'] = 'wrap';
            this.selectorLabel.style['word-break'] = 'break-word';
            this.selector.append(this.selectorLabel);

            this.setSelectorOptions(this.options);

            this.selector.id = 'sendMessageSelector';
            this.selector.classList.add('custom-selector');
            this.selector.style.display = 'flex';
            this.selector.style['flex-direction'] = 'column';
            this.selector.style.gap = '4px';

            this.selectorList.style.height = this.height;
            this.selectorList.style.width = '100%';
            this.selectorList.style.display = 'flex';
            this.selectorList.style.flexDirection = 'column';
            this.selectorList.style.gap = '8px';
            this.selectorList.style.padding = '8px';
            this.selectorList.style.overflow = 'auto';
            this.selectorList.style.border = '1px solid black';
            this.selectorList.style.borderRadius = '4px';

            this.selectorList.onclick = (event) => {
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

            this.selector.append(this.selectorList)
        }

        getElement() {
            return this.selector;
        }
    }

class CustomModal {
    constructor(options = {}) {
        this.settings = {
            title: 'Заголовок модального окна',
            content: '',
            id: 'modalId',
            buttons: [],
            height: '540px',
            width: '540px',
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
        
        headerEl.style.position = 'relative';
        headerEl.style.minHeight = '38px';
        headerEl.append(title, headerCloseButtonEl);
        
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
            height: this.settings.height
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
