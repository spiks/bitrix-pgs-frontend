const renderModalIcon = (iconElements, state) => {
  iconElements.forEach((iconElement) => {
    iconElement.classList.add('icon_hidden');

    if (state === iconElement.dataset.type) {
      iconElement.classList.remove('icon_hidden');
    }
  });
};

const renderModalVisibility = (modal, state) => {
  if (state === 'shown') {
    modal.classList.add('modal_shown');
  }

  if (state === 'hidden') {
    modal.classList.remove('modal_shown');
  }
};

const renderModalMessageVisibility = ([modalContentFrame, modalMessageFrame], state) => {
  if (state === 'shown') {
    modalContentFrame.classList.add('modal__frame_hidden');
    modalMessageFrame.classList.remove('modal__frame_hidden');
  }

  if (state === 'hidden') {
    modalContentFrame.classList.remove('modal__frame_hidden');
    modalMessageFrame.classList.add('modal__frame_hidden');
  }
};

const renderModalTypeField = (field, state) => {
  field.value = state || '';
};

const initAppLinks = () => {
  const appLinks = Array.from(document.querySelectorAll('[data-action="open-request"]'));
  const modal = document.querySelector('[data-entity="modal-request"]');
  const modalContentFrame = modal.querySelector('[data-entity="modal-content"]');
  const modalMessageFrame = modal.querySelector('[data-entity="modal-message"]');
  const modalTogglers = Array.from(modal.querySelectorAll('[data-action="close-modal"]'));
  const modalIcons = Array.from(modal.querySelectorAll('[data-entity="modal-icon"]'));
  const modalStoreTypeField = modal.querySelector('[data-entity="store-type"]');

  const state = {
    storeType: null,
    modalVisibility: 'hidden',
    messageVisibility: 'hidden',
  };

  const openModal = (appLink) => {
    state.storeType = appLink.dataset.type;
    state.modalVisibility = 'shown';

    renderModalVisibility(modal, state.modalVisibility);
    renderModalIcon(modalIcons, state.storeType);
    renderModalTypeField(modalStoreTypeField, state.storeType);
  };

  const closeModal = () => {
    state.storeType = null;
    state.modalVisibility = 'hidden';
    state.messageVisibility = 'hidden';

    renderModalVisibility(modal, state.modalVisibility);
    renderModalMessageVisibility([modalContentFrame, modalMessageFrame], state.messageVisibility);
    renderModalIcon(modalIcons, state.storeType);
    renderModalTypeField(modalStoreTypeField, state.storeType);
  };

  const showSuccessMessage = () => {
    state.messageVisibility = 'shown';
    renderModalMessageVisibility([modalContentFrame, modalMessageFrame], state.messageVisibility);
  };

  const getStoreType = () => state.storeType;

  appLinks.forEach((appLink) => {
    appLink.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(appLink);
    });
  });

  modalTogglers.forEach((modalToggler) => {
    modalToggler.addEventListener('click', (event) => {
      event.preventDefault();
      closeModal();
    });
  });

  const modalApi = {
    getStoreType,
    showSuccessMessage,
  };

  window.modalRequest = modalApi;
};

export default initAppLinks;
