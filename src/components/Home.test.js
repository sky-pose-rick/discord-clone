import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import FirestoreUser from '../logic/FirestoreUser';
import Home from './Home';

function makeMessage(user, timestamp, content, key) {
  return {
    user, timestamp, content, key,
  };
}

function sampleData() {
  // messages for a single server
  const messages = [
    makeMessage('User1', '1:00pm', 'Hello World!', 'id1'),
    makeMessage('User1', '1:01pm', 'Me again', 'id2'),
    makeMessage('User2', '1:02pm', 'Replying', 'id3'),
    makeMessage('User1', '1:03pm', 'Final Message', 'id4'),
  ];

  return messages;
}

function sendInitialMessages() {
  const messages = sampleData();

  messages.forEach((message) => {
    act(() => { FirestoreUser.sendMessage(message); });
  });
}

it('Server renders', () => {
  render(<Home />);
});

// basic functions
describe('Basic actions', () => {
  it('Can load messages', () => {
    render(<Home />);
    sendInitialMessages();

    screen.getByText(/hello world/i);
  });

  it('Can submit a message that appears', () => {
    render(<Home />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'My message.' } });
    fireEvent.keyUp(input, { code: 'Enter' });

    expect(input.value).toEqual('');
    screen.getByText(/my message/i);
  });

  it('Blank messages should be blocked', () => {
    render(<Home />);

    sendInitialMessages();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyUp(input, { code: 'Enter' });

    expect(input.value).toEqual('');
    const main = screen.getByRole('main');
    expect(main.children.length).toBe(4);
  });

  // it.todo('Message can appear from another source');
  it('Message can be deleted from another source', () => {
    render(<Home />);

    sendInitialMessages();

    act(() => { FirestoreUser.deleteMessage('id2'); });

    screen.getByText(/<deleted>/i);
  });

  it.todo('Can change to another channel');
  it.todo('Can display line breaks within a single message');
});

// actions that require authentication
describe('Authentication tests', () => {
  it.todo('Message can be deleted by user');
  it.todo('Need to be signed in to see servers');
  it.todo('Need to join server to see content');
});

// actions only completable by admins
describe('Admin actions', () => {
  it.todo('Delete a user\'s message');
  it.todo('Kick a user');
  it.todo('Create a channel');
  it.todo('Delete a channel');
  it.todo('Edit a channel');
  it.todo('Edit the server');
});
