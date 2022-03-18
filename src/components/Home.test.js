import React from 'react';
import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import FirestoreUser from '../logic/FirestoreUser';
import Home from './Home';

function renderWithRouter() {
  render(
    <MemoryRouter initialEntries={['/discord-clone/server/server-1/channel-1']}>
      <Routes>
        <Route path="/discord-clone/server/:serverKey/:channelKey" element={<Home />} />
      </Routes>
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

  it('Correct channel is "active"', () => {
    renderWithRouter();
    setDummyData();

    const firstChannelNav = screen.getAllByRole('navigation')[1];
    const firstActiveChannel = within(firstChannelNav).getByRole('link', { current: true });
    expect(firstActiveChannel.href).toMatch(/channel-1/i);

    const secondChannel = within(firstChannelNav).getAllByRole('link')[1];
    fireEvent.click(secondChannel);

    const secondChannelNav = screen.getAllByRole('navigation')[1];
    const secondActiveChannel = within(secondChannelNav).getByRole('link', { current: true });
    expect(secondActiveChannel.href).toMatch(/channel-2/i);
  });

  it('Correct server is "active"', () => {
    renderWithRouter();
    setDummyData();

    const firstServerNav = screen.getAllByRole('navigation')[0];
    const firstActiveServer = within(firstServerNav).getByRole('link', { current: true });
    expect(firstActiveServer.href).toMatch(/server-1/i);

    const secondServer = within(firstServerNav).getAllByRole('link')[1];
    fireEvent.click(secondServer);

    const secondServerNav = screen.getAllByRole('navigation')[0];
    const secondActiveServer = within(secondServerNav).getByRole('link', { current: true });
    expect(secondActiveServer.href).toMatch(/server-2/i);
  });

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
