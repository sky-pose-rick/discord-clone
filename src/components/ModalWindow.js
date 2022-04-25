import React from 'react';
import propTypes from 'prop-types';

function makeInput(input, key) {
  const { type, label, placeholder } = input;
  const id = `modal-${key}`;
  switch (type) {
    case 'label':
      return (<div key={key}>{label}</div>);
    case 'text':
      return (
        <div key={key}>
          <label htmlFor={id}>{label}</label>
          <input type="text" defaultValue={placeholder} id={id} />
        </div>
      );
    case 'textarea':
      return (
        <div key={key}>
          <label htmlFor={id}>{label}</label>
          <textarea defaultValue={placeholder} id={id} />
        </div>
      );
    case 'file':
      return (
        <div key={key}>
          <label htmlFor={id}>{label}</label>
          <input type="file" defaultValue={placeholder} id={id} />
        </div>
      );
    default:
      return (<div key={key}>{`${type}: ${label}: ${placeholder}`}</div>);
  }
}

function ModalWindow(props) {
  const {
    inputs, submitLabel, onSubmit, onClose,
  } = props;

  return (
    <div className="ModalWindow">
      {inputs.map((input, index) => makeInput(input, index))}
      <button type="submit" onClick={onSubmit}>{submitLabel}</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </div>
  );
}

ModalWindow.propTypes = {
  inputs: propTypes.arrayOf(propTypes.shape({
    type: propTypes.string,
    label: propTypes.string,
    placeholder: propTypes.string,
  })),
  submitLabel: propTypes.string,
  onSubmit: propTypes.func,
  onClose: propTypes.func,
};

ModalWindow.defaultProps = {
  inputs: [],
  submitLabel: 'Yes',
  onSubmit: () => {},
  onClose: () => {},
};

export default ModalWindow;
