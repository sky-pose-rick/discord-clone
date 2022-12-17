import React, { useState } from 'react';
import ModalWindow from '../components/ModalWindow';

let active;
let setActive;

let modalDetails = {
  onSubmit: null,
  onClose: null,
  inputs: [],
  submitLabel: 'missing',
};

function getModalWindow() {
  [active, setActive] = useState(false);

  return (
    <div className="modal-wrapper">
      {active && (
      <ModalWindow
        inputs={modalDetails.inputs}
        submitLabel={modalDetails.submitLabel}
        onSubmit={modalDetails.onSubmit}
        onClose={modalDetails.onClose}
      />
      )}
    </div>
  );
}

function useModal() {
  const createModal = (inputs, submitLabel, submitAction, closeAction) => {
    setActive((prev) => {
      if (!prev) {
        const onSubmit = (args) => {
          if (submitAction) { submitAction(args); }
          setActive(false);
        };
        const onClose = (args) => {
          if (closeAction) { closeAction(args); }
          setActive(false);
        };
        modalDetails = {
          inputs, submitLabel, onSubmit, onClose,
        };
        return true;
      }
      return false;
    });
  };

  return createModal;
}

export default { useModal, getModalWindow };
