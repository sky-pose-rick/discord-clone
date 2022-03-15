import React from 'react';
import styled from 'styled-components';
import ServerIcon from './ServerIcon';
import Message from './Message';

import ServerStyles from '../component-styles/ServerStyles';

const {
  ServerFrame,
  ServerNav,
  HeaderBar,
  ChannelNav,
  Channel,
  UserPanel,
  MainContent,
  InputBox,
  UserList,
} = ServerStyles;

const message1 = {
  user: 'User1',
  timestamp: 'fifty-two',
  content: [
    'How are you?',
    'Line #2',
    'Thing three',
    '4',
    '5',
    '6',
  ],
};

const message2 = {
  user: 'User2',
  timestamp: '3:15am',
  content: [
    'short',
  ],
};

const message3 = {
  user: 'User3',
  timestamp: 'Yesterday at 4:50pm',
  content: [
    'First',
    'Second',
  ],
};

function Home() {
  return (
    <ServerFrame>
      <ServerNav>
        <ServerIcon serverName="Home" src="gone" alt="@me" />
        <div className="line" />
        <ServerIcon serverName="Server 1" src="discord-clone/img/profile2.png" />
        <ServerIcon serverName="Server 2" src="gone" alt="OOP" />
        <ServerIcon serverName="Server 7" src="discord-clone/img/profile2.png" />
        <ServerIcon serverName="Server 8" src="gone" alt="OOP" />
        <ServerIcon serverName="New Server" src="gone" alt="create" />
        <ServerIcon serverName="Find Server" src="gone" alt="browse" />
      </ServerNav>
      <HeaderBar>
        <div>Server Name</div>
        <div>
          <span className="symbolled">My-channel</span>
          <div className="line" />
          <span className="channel-desc">Speak your piece</span>
        </div>
      </HeaderBar>
      <ChannelNav>
        <Channel>
          <span className="symbolled">My-channel</span>
        </Channel>
        <Channel><span className="symbolled">Channel-1</span></Channel>
        <Channel><span className="symbolled">Channel-2</span></Channel>
        <Channel><span className="symbolled">Channel-3</span></Channel>
        <Channel><span className="symbolled">Channel-4</span></Channel>
        <Channel><span className="symbolled">Channel-5</span></Channel>
        <Channel><span className="symbolled">Channel-6</span></Channel>
      </ChannelNav>
      <UserPanel>
        User
      </UserPanel>
      <MainContent>
        {
          message1.content.map((text, index) => (
            <Message user={message1.user} timestamp={message1.timestamp} content={text} key={`mess1${index}`} />
          ))
        }
        {
          message2.content.map((text, index) => (
            <Message user={message2.user} timestamp={message2.timestamp} content={text} key={`mess2${index}`} />
          ))
        }
        {
          message3.content.map((text, index) => (
            <Message user={message3.user} timestamp={message3.timestamp} content={text} key={`mess3${index}`} />
          ))
        }
      </MainContent>
      <InputBox>
        <input type="text" placeholder="Message #Channel-name" />
      </InputBox>
      <UserList>
        UserList
      </UserList>
    </ServerFrame>
  );
}

export default Home;
