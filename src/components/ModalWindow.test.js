import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ModalWindow from './ModalWindow';

const confirm = 'Yes';
const save = 'Save';

function renderWindow(inputList, submitLabel, onSubmit, onClose) {
  render(
    <ModalWindow
      inputs={inputList}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      onClose={onClose}
    />,
  );
}

it('Can render without props', () => {
  render(
    <ModalWindow />,
  );
});

it('Can submit', () => {
  const inputList = [
    {
      type: 'label',
      label: 'Basic Question?',
      placeholder: 'none',
    },
  ];

  const onSumbit = jest.fn();

  renderWindow(inputList, confirm, onSumbit, null);

  const submitButton = screen.getAllByRole('button')[0];
  fireEvent.click(submitButton);
  expect(onSumbit.mock.calls.length).toBe(1);
});

it('Can cancel a window', () => {
  const inputList = [
    {
      type: 'label',
      label: 'Basic Question?',
      placeholder: 'none',
    },
  ];

  const onClose = jest.fn();

  renderWindow(inputList, confirm, null, onClose);

  const closeButton = screen.getAllByRole('button')[1];
  fireEvent.click(closeButton);
  expect(onClose.mock.calls.length).toBe(1);
});

it('Text input', () => {
  const inputList = [
    // text input
    {
      type: 'text',
      label: 'Q1',
      placeholder: '',
    },
  ];

  renderWindow(inputList, save, null, null);
  screen.getByRole('textbox');
});

it('Textarea', () => {
  const inputList = [
    // textarea
    {
      type: 'textarea',
      label: 'Q1',
      placeholder: '',
    },
  ];

  renderWindow(inputList, save, null, null);
  screen.getByRole('textbox');
});

it('File', () => {
  const inputList = [
    // file
    {
      type: 'file',
      label: 'File submit',
      placeholder: '',
    },
  ];

  renderWindow(inputList, save, null, null);
  const label = screen.getByText(/file submit/i);
  const fileInput = label.nextSibling;
  expect(fileInput.type).toMatch(/file/);
});

it('Displays text', () => {
  const inputList = [
    {
      type: 'label',
      label: 'Basic Question?',
      placeholder: 'none',
    },
  ];

  renderWindow(inputList, confirm, null, null);
  screen.getByText(/basic question/i);
});
