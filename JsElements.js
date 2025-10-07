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

        this.modalContainer = this.createModalContainer();
        this.header = this.createHeader();
        this.main = this.createMain();
        this.footer = this.createFooter();
        this.modal = this.createModal();
        
        this.initEvents();
        this.render();
    }

    createModalContainer() {
        const container = document.createElement('div');
        container.id = this.settings.id;
        container.className = 'custom-modal';
        
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
        
        Object.entries(styles).forEach(([key, value]) => {
            container.style[key] = value;
        });
        
        return container;
    }

    createHeader() {
        const header = document.createElement('div');
        header.classList.add('header');
        
        const title = document.createElement('h3');
        title.textContent = this.settings.title;
        
        const closeButton = document.createElement('button');
        closeButton.classList.add('close');
        closeButton.textContent = '×';
        
        const buttonStyles = {
            position: 'absolute',
            width: '38px',
            height: '38px',
            top: '-8px',
            right: '0'
        };
        
        Object.entries(buttonStyles).forEach(([key, value]) => {
            closeButton.style[key] = value;
        });
        
        header.style.position = 'relative';
        header.style.minHeight = '38px';
        header.append(title, closeButton);
        
        return header;
    }

    createMain() {
        const main = document.createElement('div');
        main.classList.add('main');
        
        const styles = {
            display: 'flex',
            flexDirection: 'column',
            height: '0',
            gap: '8px',
            overflow: 'auto',
            flex: '1'
        };
        
        Object.entries(styles).forEach(([key, value]) => {
            main.style[key] = value;
        });
        
        if (typeof this.settings.content === 'string') {
            main.innerHTML = this.settings.content;
        } else {
            main.append(this.settings.content);
        }
        
        return main;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.classList.add('footer');
        
        this.settings.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.classList.add('button');
            btn.textContent = button.text;
            btn.onclick = button.onClick;
            footer.append(btn);
        });
        
        return footer;
    }

    createModal() {
        const modal = document.createElement('div');
        
        const styles = {
            padding: '14px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: this.settings.width,
            height: this.settings.height
        };
        
        Object.entries(styles).forEach(([key, value]) => {
            modal.style[key] = value;
        });
        
        return modal;
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

            document.removeEventListener('keydown', this.closeOnEscButton);
            this.modalContainer.remove();
        };

        this.header.querySelector('.close').addEventListener('click', this.closeModal);

        if (this.settings.closeOnEsc) {
            document.addEventListener('keydown', this.closeOnEscButton);
        }

        if (this.settings.closeOnOverlay) {
            this.modalContainer.addEventListener('click', (e) => {
                if (e.target === this.modalContainer) {
                    this.closeModal();
                }
            });
        }
    }

    render() {
        this.modal.append(this.header, this.main, this.footer);
        this.modalContainer.append(this.modal);
        document.body.append(this.modalContainer);
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
