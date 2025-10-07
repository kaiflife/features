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

    function openCustomModal(options = {}) {
        const settings = {
            title: 'Заголовок модального окна',
            content: '',
            id: 'modalId',
            buttons: [],
            height: '540px',
            width: '540px',
            onClose: null,
            closeOnEsc: true,
            shouldAutoClose: true,
            closeOnOverlay: true,
            ...options
        };

        const modalContainer = document.createElement('div')
        modalContainer.id = settings.id;
        modalContainer.className = 'custom-modal';
        modalContainer.style.width = '100vw';
        modalContainer.style.height = '100vh';
        modalContainer.style.zIndex = '3';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.backgroundColor = 'rgba(0,0,0,0.4)';
        modalContainer.style.display = 'flex';
        modalContainer.style['align-items'] = 'center';
        modalContainer.style['justify-content'] = 'center';

        const header = document.createElement('div');
        header.classList.add('header');
        header.style.position = 'relative';
        header.style['min-height'] = '38px';

        const title = document.createElement('h3');
        title.textContent = settings.title;

        const closeButton = document.createElement('button');
        closeButton.classList.add('close');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.width = '38px';
        closeButton.style.height = '38px';
        closeButton.style.top = '-8px';
        closeButton.style.right = '0';

        const main = document.createElement('div');
        main.classList.add('main');
        main.style.display = 'flex';
        main.style['flex-direction'] = 'column';
        main.style['height'] = '0';
        main.style['gap'] = '8px';
        main.style['overflow'] = 'auto';
        main.style['flex'] = '1';

        if (typeof content === 'string') {
            main.innerHTML = settings.content;
        } else {
            main.append(settings.content)
        }

        const footer = document.createElement('div');
        footer.classList.add('footer');

        const modal = document.createElement('div')
        modal.style.padding = '14px';
        modal.style['background-color'] = 'white';
        modal.style.display = 'flex';
        modal.style['flex-direction'] = 'column';
        modal.style['gap'] = '8px';
        modal.style['width'] = settings.width
        modal.style['height'] = settings.height

        function closeOnEscButton(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }

        const closeModal = () => {
            if (settings.onClose) {
                const shouldStopCloseModal = settings.onClose();

                if (shouldStopCloseModal) {
                    return;
                }
            }

            document.removeEventListener('keydown', closeOnEscButton)
            modalContainer.remove();
        };

        settings.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.classList.add('button');
            btn.textContent = button.text;
            btn.onclick = button.onClick;
            footer.append(btn);
        });

        header.append(title, closeButton);
        modal.append(header, main, footer);
        modalContainer.append(modal)
        document.body.append(modalContainer)

        closeButton.onclick = closeModal;

        if (settings.closeOnEsc) {
            document.addEventListener('keydown', closeOnEscButton);
        }

        return {
            close: closeModal,
        };
    }
