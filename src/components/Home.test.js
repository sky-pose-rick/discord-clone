import { render, screen } from '@testing-library/react';
import Home from './Home';

it('Server renders', () => {
  render(<Home />);
});

// basic functions
describe('Basic actions', () => {
  it.todo('Can submit a message that appears');
  it.todo('Message can appear from another source');
  it.todo('Message can be deleted from another source');
  it.todo('Can change to another channel');
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
