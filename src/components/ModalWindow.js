import React, { useState } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const ModalBackground = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  display: float;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background-color: gray;
  border: solid 3px #444;
  padding: 30px;

  >div{
    padding: 10px 0px;
  }

  button{
    padding: 5px;
    color: white;
  }

  button[type=button]{
    background-color: red;
  }

  button[type=submit]{
    background-color: green;
  }
`;

function makeInput(input, index, onInputChange, inputValues) {
  const { type, label, placeholder } = input;
  const id = `modal-${index}`;
  const onChange = (e) => {
    onInputChange(index, e.target.value);
  };

  switch (type) {
    case 'label':
      return (<div key={index}>{label}</div>);
    case 'text':
      return (
        <div key={index}>
          <label htmlFor={id}>{label}</label>
          <input type="text" value={inputValues[index]} onChange={onChange} id={id} />
        </div>
      );
    case 'textarea':
      return (
        <div key={index}>
          <label htmlFor={id}>{label}</label>
          <textarea value={inputValues[index]} onChange={onChange} id={id} />
        </div>
      );
    case 'file':
      return (
        <div key={index}>
          <label htmlFor={id}>{label}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              e.preventDefault();
              const file = e.target.files[0];
              onInputChange(index, file);
            }}
            id={id}
          />
        </div>
      );
    default:
      return (<div key={index}>{`${type}: ${label}: ${placeholder}`}</div>);
  }
}

function ModalWindow(props) {
  const {
    inputs, submitLabel, onSubmit, onClose,
  } = props;

  const [inputValues, setInputValues] = useState(inputs.map((input) => input.placeholder));

  const submitFunc = (e) => {
    e.preventDefault();
    onSubmit(inputValues);
  };

  const onInputChange = (index, value) => {
    setInputValues((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  return (
    <ModalBackground>
      <ModalBox>
        {inputs.map((input, index) => makeInput(input, index, onInputChange, inputValues))}
        <button type="submit" onClick={submitFunc}>{submitLabel}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </ModalBox>
    </ModalBackground>
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
