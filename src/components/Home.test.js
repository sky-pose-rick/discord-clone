import React from 'react';
import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import FirestoreUser from '../logic/FirestoreUser';
import Home from './Home';

function renderWithRouter() {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

function setDummyData() {
  act(() => { FirestoreUser.pushTestContent(); });
}

it('Server renders', () => {
  renderWithRouter();
});

// basic functions
describe('Basic actions', () => {
  it('Can load messages', () => {
    renderWithRouter();
    setDummyData();

    screen.getByText(/hello world/i);
  });

  it('Can submit a message that appears', () => {
    renderWithRouter();
    setDummyData();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'My message.' } });
    fireEvent.keyUp(input, { code: 'Enter' });

    expect(input.value).toEqual('');
    screen.getByText(/my message/i);
  });

  it('Blank messages should be blocked', () => {
    renderWithRouter();
    setDummyData();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyUp(input, { code: 'Enter' });

    expect(input.value).toEqual('');
    const main = screen.getByRole('main');
    expect(main.children.length).toBe(4);
  });

  // it.todo('Message can appear from another source');
  it('Message can be deleted from another source', () => {
    renderWithRouter();
    setDummyData();

    act(() => { FirestoreUser.deleteMessage('id2'); });

    screen.getByText(/<deleted>/i);
  });

  it('Channel list has links to channels', () => {
    // put servers and channels in navs
    renderWithRouter();
    setDummyData();

    const navs = screen.getAllByRole('navigation');
    // console.log(navs);
    const channelList = within(navs[1]).getAllByRole('link');
    // dummy data has 5 channels
    expect(channelList.length).toBe(5);
  });

  it.todo('Correct channel is "active"');
  it.todo('Can display line breaks within a single message');
  it.todo('Scroll up to fetch more messages');
  it.todo('Display a message when the top of channel is reached');
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
