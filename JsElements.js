const setStyleToEl = (style, el) => {
    if (style && el) {
        Object.keys(style).forEach(styleKey => {
            el.style[styleKey] = style[styleKey]
        })
    }
}

class CustomLabel {
    static containerElErrorClass = 'custom-error'
    static containerElClass = 'custom-label'

    constructor({ label = '', isRequired = false }) {
        this.labelEl = document.createElement('span');
        this.isRequired = isRequired;
        this.label = `${label}${isRequired ? ' (Обязательное поле)' : ''}`;
    }

    init() {
        this.labelEl.innerHTML = this.label;
        this.labelEl.dataset.label = this.label;
        this.labelEl.className = CustomLabel.containerElClass;
    }

    static setError({ errorText, containerEl, hasError }) {
        if (!containerEl) return;

        const labelEl = containerEl.querySelector(`.${CustomLabel.containerElClass}`);

        const addErrorClass = (isAdd = false) => {
            containerEl.classList[isAdd ? 'add' : 'remove'](CustomLabel.containerElErrorClass)
        }

        if (labelEl) {
            if (errorText !== undefined) {
                if (errorText) {
                    labelEl.innerHTML += errorText
                    addErrorClass(true)
                } else {
                    labelEl.innerHTML = labelEl.dataset.label;
                    addErrorClass()
                }
            } else {
                if (hasError) {
                    addErrorClass(true)
                } else {
                    addErrorClass()
                }
            }
        }
    }
}

class CustomSelector extends CustomLabel {
    static optionSelectedClass = 'option-selected'
    
    static getSelectedOptions (el) {
        if (!el) return [];

        const selectedOptionsEls = el.querySelectorAll('.option-selected');

        if (selectedOptionsEls) {
            return Array.from(selectedOptionsEls).map(item => item.value)
        }

        return []
    }

    constructor({ id = '', options = [], height = '300px', isMulti = true, label = '', isRequired = false }) {
        super({ label, isRequired })

        this.id = id;
        this.options = options;
        this.height = height;
        this.isMulti = isMulti;

        this.containerEl = document.createElement('div');
        this.optionsContainerEl = document.createElement('ul');

        this.init();
    }

    getOptionString({ isSelected, id, name }) {
        return `<li class="${isSelected ? CustomSelector.optionSelectedClass : ''}" value="${id}">${name}</li>`;
    }

    setSelectorOptions(options = []) {
        this.optionsContainerEl.innerHTML = options.reduce((newStringHtml, { name, id }) => {
            newStringHtml += this.getOptionString({ isSelected: false, id, name });
            return newStringHtml;
        }, '');
    }

    init() {
        super.init();

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
                if (event.target.classList.contains(CustomSelector.optionSelectedClass)) {
                    event.target.classList.remove(CustomSelector.optionSelectedClass);
                } else {
                    if (!this.isMulti) {
                        this.optionsContainerEl.querySelector(`.${CustomSelector.optionSelectedClass}`)?.classList.remove(CustomSelector.optionSelectedClass);
                    }
                    event.target.classList.add(CustomSelector.optionSelectedClass);
                }
            }
        };

        this.containerEl.append(this.optionsContainerEl)
    }

    getElement() {
        return this.containerEl;
    }
}

class CustomTextarea extends CustomLabel {
    static getTextarea(el) {
        const textareaEl = el.querySelector('textarea');
        
        if (!el) return null;

        return {
            textareaEl,
            value: textareaEl.value,
        }
    }

    constructor({ id = '', value = '', label = 'Введите текст сообщения', rows = 4, containerClassName = '', className = '', style, containerStyle, isRequired }) {
        super({ label, isRequired })

        this.id = id;
        this.value = value;
        this.rows = rows;
        this.className = className;
        this.containerClassName = containerClassName;
        this.style = style;
        this.containerStyle = containerStyle;

        this.containerEl = document.createElement('div');
        this.inputEl = document.createElement('textarea');

        this.init();
    }

    init() {
        super.init();

        this.containerEl.className = `custom-textarea-container ${this.containerClassName}`;
        setStyleToEl({ display: 'flex', 'flex-direction': 'column', gap: '4px' }, this.containerEl)

        this.containerEl.append(this.labelEl);

        this.inputEl.rows = this.rows;
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
