import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import FirestoreUser from '../logic/FirestoreUser';
import Home from './Home';

function makeMessage(user, timestamp, content) {
  return { user, timestamp, content };
}

function sampleData() {
  // messages for a single server
  const messages = [
    makeMessage('User1', '1:00pm', 'Hello World!'),
    makeMessage('User1', '1:01pm', 'Me again'),
    makeMessage('User2', '1:02pm', 'Replying'),
    makeMessage('User1', '1:03pm', 'Final Message'),
  ];

  return messages;
}

it('Server renders', () => {
  render(<Home />);
});

// basic functions
describe('Basic actions', () => {
  it('Can load messages', () => {
    render(<Home />);

    const messages = sampleData();

    messages.forEach((message) => {
      act(() => { FirestoreUser.sendMessage(message); });
    });

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
  it.todo('Message can appear from another source');
  it.todo('Message can be deleted from another source');
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
