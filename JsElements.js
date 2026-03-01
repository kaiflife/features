const setStyleToEl = (style, el) => {
  // Валидация
  if (!style || !el || !(el instanceof Element) || typeof style !== 'object') return;

  // Если style пустой, выходим
  if (Object.keys(style).length === 0) return;

  let cssText = '';
  let hasStyles = false;

  for (const [key, value] of Object.entries(style)) {
    // Пропускаем null, undefined, пустые строки
    if (value == null || value === '') continue;

    if (hasStyles) {
      cssText += '; ';
    }
    cssText += `${key}: ${value}`;
    hasStyles = true;
  }

  // Только если есть что добавить
  if (hasStyles) {
    el.style.cssText += el.style.cssText ? '; ' + cssText : cssText;
  }
};

const prepareClassNames = (classNames = ['']) => {
  if (!classNames || classNames.length === 0) return '';

  const result = [];
  for (let i = 0; i < classNames.length; i++) {
    const className = classNames[i];
    if (className) {
      result.push(className);
    }
  }
  return result.join(' ');
};

class CustomButton {
    static errorClass = 'error'
    static className = 'custom-button'

    constructor({ text = '', className, onClick }) {
        this.buttonEl = document.createElement('button');
        this.text = text;
        this.className = className;
        this.onClick = onClick;

        this.init()
    }

    init() {
        this.buttonEl.textContent = this.text;
        this.buttonEl.onclick = this.onClick;
        this.buttonEl.className = prepareClassNames([CustomButton.className, this.className]);
    }

    getElement() {
        return this.buttonEl;
    }
}

class CustomLabel {
    static errorClass = 'custom-error'
    static className = 'custom-label'

    constructor({ label = '', isRequired = false }) {
        this.labelEl = document.createElement('span');
        this.isRequired = isRequired;
        this.label = `${label}${isRequired ? ' (Обязательное поле)' : ''}`;
    }

    init() {
        this.labelEl.textContent = this.label;
        this.labelEl.dataset.label = this.label;
        this.labelEl.className = CustomLabel.className;
    }

    static setError({ errorText, containerEl, hasError }) {
        if (!containerEl) return;

        const labelEl = containerEl.querySelector(`.${CustomLabel.className}`);

        const addErrorClass = (isAdd = false) => {
            containerEl.classList[isAdd ? 'add' : 'remove'](CustomLabel.errorClass)
        }

        if (labelEl) {
            if (errorText !== undefined) {
                if (errorText) {
                    labelEl.textContent += errorText
                    addErrorClass(true)
                } else {
                    labelEl.textContent = labelEl.dataset.label;
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
    static optionSelectedClassName = 'option-selected'
    static optionDisabledClassName = 'option-disabled'
    static className = 'custom-selector-container'
    static listeners = []
    static openedSelectorId = '';
    static hasOutsideClickListener = false;    
    
    static getSelectedOptions (el) {
        if (!el) return [];

        const selectedOptionsEls = el.querySelectorAll('.option-selected');

        if (selectedOptionsEls) {
            return Array.from(selectedOptionsEls).map(item => item.dataset.value)
        }

        return []
    }

    static getNotDisabledOptionsEls (el) {
        if (!el) return [];

        const notDisabledOptionsEls = el.querySelectorAll(`li:not(.${CustomSelector.optionDisabledClassName}`);

        if (notDisabledOptionsEls) {
            return Array.from(notDisabledOptionsEls)
        }

        return []
    }

    constructor({ 
        id = '',
        options = [],
        height = '300px',
        isMulti = true,
        label = '',
        isRequired = false,
        onchange,
        hasSearch = true,
        shouldHideOptions = true,
        shouldCloseOutside = true,
        selectAllButtonClassName = '',
        inversButtonClassName = '',
        unselectAllButtonClassName = '',
    }) {
        super({ label, isRequired })

        if (!CustomSelector.hasOutsideClickListener) {
            CustomSelector.hasOutsideClickListener = true;

            document.addEventListener('click', (event) => {
                if (openedSelectorId && listeners.includes(openedSelectorId)) {
                    if (!window[openedSelectorId].contains(event.target)) {
                        this.toggleOptionsAndActions(false);
                    }
                }
            });
        }

        // props
        this.id = id;
        this.options = options;
        this.height = height;

        // booleans
        this.isMulti = isMulti;
        this.hasSearch = hasSearch;
        this.shouldCloseOutside = shouldCloseOutside;
        this.shouldHideOptions = shouldHideOptions;

        // functions
        this.onchange = onchange;

        // classnames
        this.selectAllButtonClassName = selectAllButtonClassName;
        this.inversButtonClassName = inversButtonClassName;
        this.unselectAllButtonClassName = unselectAllButtonClassName;

        // els
        this.containerEl = document.createElement('div');
        this.selectedOptionsEl = document.createElement('div');
        this.headerEl = document.createElement('div');
        this.searchInputEl = document.createElement('input');
        this.optionsAndActionsEl = document.createElement('div');
        this.optionsContainerEl = document.createElement('ul');

        this.init();
    }

    getOptionString({ isSelected, isDisabled, id, name, value }) {
        return `<li class="${prepareClassNames([isSelected && CustomSelector.optionSelectedClassName, isDisabled && CustomSelector.optionDisabledClassName])}" data-value="${value ?? id}">${name}</li>`;
    }

    setSelectorOptions(options = []) {
        this.optionsContainerEl.innerHTML = options.reduce((newStringHtml, { name, id, isDisabled, value }) => {
            newStringHtml += this.getOptionString({ isSelected: false, isDisabled , id, name, value });
            return newStringHtml;
        }, '');
    }

    handleSearch(event) {
        const searchText = event.target.value.toLowerCase();
        const options = this.optionsContainerEl.querySelectorAll('li');
        
        options.forEach(option => {
            const optionText = option.textContent.toLowerCase();
            if (optionText.includes(searchText)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }

    setSelectedOptions() {
        const selectedOptions = CustomSelector.getSelectedOptions(this.containerEl)

        const fragment = document.documentFragment();

        fragment.append(...selectedOptions)

        this.selectedOptionsEl.innerHTML = fragment;
    }

    toggleOptionsAndActions(isVisible) {
        const visiblePropValue = isVisible !== undefined && isVisible ? 'flex' : 'none';
        const stylePropValue =  this.optionsAndActionsEl.style.display === 'none' ? 'flex' : 'none';

        const isOpened = (visiblePropValue || stylePropValue) === 'flex'

        if (isOpened) CustomSelector.openedSelectorId = this.id;

        setStyleToEl({ 'display': visiblePropValue || stylePropValue}, this.optionsAndActionsEl)
    }

    init() {
        super.init();

        this.containerEl.id = this.id;
        this.containerEl.classList.add(CustomSelector.className);
        
        setStyleToEl({
            'display': 'flex',
            'flex-direction': 'column',
            'gap': '4px',
        }, this.containerEl)

        if (this.shouldHideOptions) {
            this.containerEl.addEventListener('click', (event) => {
                event.stopPropagation();

                this.toggleOptionsAndActions(true);
            });
        }

        this.containerEl.append(this.labelEl);


        setStyleToEl({ 'display': 'flex', 'flex-direction': 'column', 'width': '100%'}, this.headerEl);
        setStyleToEl({ 'display': 'flex', 'flex-wrap': 'wrap', 'gap': '4px', 'width': '100%', 'height': 200 }, this.selectedOptionsEl);

        this.headerEl.append(this.selectedOptionsEl);
        
        if (this.hasSearch) {
            this.searchInputEl.placeholder = 'Поиск';
            this.searchInputEl.addEventListener('input', this.handleSearch.bind(this));
            this.headerEl.append(this.searchInputEl);
        }
        
        this.containerEl.append(this.headerEl);

        const actionButtonsContainerEl = document.createElement('div');
        
        setStyleToEl({
            'display': 'flex',
            'gap': '8px',
            'align-items': 'center',
        }, actionButtonsContainerEl)

        const selectAllButtonEntity = new CustomButton({
            text: 'Выбрать всё',
            className: this.selectAllButtonClassName,
            onClick: () => {
                const notDisabledOptionsEls = CustomSelector.getNotDisabledOptionsEls(this.containerEl);

                notDisabledOptionsEls.forEach(optionEl => optionEl.classList.add(CustomSelector.optionSelectedClassName));

                this.setSelectedOptions();
            }
        })

        const inversButtonEntity = new CustomButton({
            text: 'Инвертировать выбор',
            className: this.inversButtonClassName,
            onClick: () => {
                const notDisabledOptionsEls = CustomSelector.getNotDisabledOptionsEls(this.containerEl);

                notDisabledOptionsEls.forEach(optionEl => optionEl.classList.toggle(CustomSelector.optionSelectedClassName));

                this.setSelectedOptions();
            }
        });

        const unselectAllButtonEntity = new CustomButton({
            text: 'Сбросить выбор',
            className: this.unselectAllButtonClassName,
            onClick: () => {
                const notDisabledOptionsEls = CustomSelector.getNotDisabledOptionsEls(this.containerEl);

                notDisabledOptionsEls.forEach(optionEl => optionEl.classList.remove(CustomSelector.optionSelectedClassName));

                this.setSelectedOptions();
            }
        })
        
        actionButtonsContainerEl.append(
            selectAllButtonEntity.getElement(),
            inversButtonEntity.getElement(),
            unselectAllButtonEntity.getElement()
        );
        
        this.setSelectorOptions(this.options);

        setStyleToEl({
            'height': this.height,
            'width': '100%',
            'display': 'flex',
            'flex-direction': 'column',
            'gap': '8px',
            'padding': '8px',
            'overflow': 'auto',
            'border': '1px solid black',
            'border-radius': '4px',
        }, this.optionsContainerEl)

        this.optionsContainerEl.addEventListener('click', (event) => {
            if (event.target.tagName === 'UL') return;

            const liTarget = event.target.tagName === 'LI' ? event.target : event.target.closest('li')

            const isDisabledOption = liTarget.classList.contains(CustomSelector.optionDisabledClassName);


            if (liTarget && !isDisabledOption) {
                CustomLabel.setError({ hasError: false, containerEl: this.containerEl })

                if (liTarget.classList.contains(CustomSelector.optionSelectedClassName)) {
                    liTarget.classList.remove(CustomSelector.optionSelectedClassName);
                } else {
                    if (!this.isMulti) {
                        this.optionsContainerEl.querySelector(`.${CustomSelector.optionSelectedClassName}`)?.classList.remove(CustomSelector.optionSelectedClassName);
                    }
                    liTarget.classList.add(CustomSelector.optionSelectedClassName);
                }

                if (this.onchange) {
                    this.onchange(event, CustomSelector.getSelectedOptions(liTarget))
                }
            }
        });

        if (this.shouldCloseOutside) {
            CustomSelector.listeners.append(id)
        }

        setStyleToEl({ 'flex-direction': 'column', 'gap': '4px' }, this.optionsAndActionsEl);

        this.toggleOptionsAndActions()
        
        this.optionsAndActionsEl.append(this.optionsContainerEl);
        this.optionsAndActionsEl.append(actionButtonsContainerEl);
        this.containerEl.append(this.optionsAndActionsEl);
    }

    getElement() {
        return this.containerEl;
    }
}

class CustomTextarea extends CustomLabel {
    static className = 'custom-textarea-container'

    static getTextarea(el) {
        const textareaEl = el.querySelector('textarea');
        
        if (!el) return null;

        return {
            textareaEl,
            value: textareaEl.value,
        }
    }

    constructor({
        id = '',
        value = '',
        label = 'Введите текст сообщения',
        rows = 4,
        containerClassName = '',
        className = '',
        style,
        containerStyle,
        isRequired = false,
    }) {
        super({ label, isRequired })

        this.id = id;
        this.value = value;
        this.rows = rows;
        this.className = className;
        this.containerClassName = containerClassName;
        this.style = style;
        this.onchange = onchange;
        this.containerStyle = containerStyle;

        this.containerEl = document.createElement('div');
        this.inputEl = document.createElement('textarea');

        this.init();
    }

    init() {
        super.init();

        this.containerEl.className = prepareClassNames([CustomTextarea.className, this.containerClassName]);
        setStyleToEl({ 'display': 'flex', 'flex-direction': 'column', 'gap': '4px' }, this.containerEl)

        this.containerEl.append(this.labelEl);

        this.inputEl.rows = this.rows;
        this.inputEl.className = this.className;
        this.inputEl.onchange = (event) => {
            if (this.onchange) {
                this.onchange(event)
            }
        }
        this.inputEl.onkeydown = (event) => {
            CustomLabel.setError({ hasError: false, containerEl: this.containerEl });
        }

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
    static className = 'custom-modal-container'

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
            closeOnOverlay: false,
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
        containerEl.className = CustomModal.className;

        const styles = {
            'width': '100vw',
            'height': '100vh',
            'z-index': '3',
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'background-color': 'rgba(0,0,0,0.4)',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center'
        };

        setStyleToEl(styles, containerEl)

        return containerEl;
    }

    createHeaderEl() {
        const headerEl = document.createElement('div');
        headerEl.classList.add('header');
        setStyleToEl({ 'padding-right': '56px', 'position': 'relative', 'min-height': '38px' }, headerEl);


        const title = document.createElement('h3');
        title.textContent = this.settings.title;

        this.closeButtonEl = document.createElement('button');
        this.closeButtonEl.classList.add('close');
        this.closeButtonEl.textContent = '×';

        const buttonStyles = {
            'position': 'absolute',
            'width': '38px',
            'height': '38px',
            'top': '-8px',
            'right': '0'
        };

        setStyleToEl(buttonStyles, this.closeButtonEl)

        headerEl.append(title, this.closeButtonEl);

        return headerEl;
    }

    createMainEl() {
        const mainEl = document.createElement('div');
        mainEl.classList.add('main');

        const styles = {
            'display': 'flex',
            'flex-direction': 'column',
            'height': '0',
            'gap': '8px',
            'overflow': 'auto',
            'flex': '1'
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
            'padding': '14px',
            'background-color': 'white',
            'display': 'flex',
            'flex-direction': 'column',
            'gap': '8px',
            'width': this.settings.width,
            'height': this.settings.height,
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
        if (this.settings.closeOnEsc) {
            document.removeEventListener('keydown', this.closeOnEscButton);
        }
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
