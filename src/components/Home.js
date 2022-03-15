import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ServerIcon from './ServerIcon';
import Message from './Message';
import FirestoreUser from '../logic/FirestoreUser';

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

function useMessages() {
  const [messages, setMessages] = useState([]);

  // useEffect that updates with each render
  useEffect(() => {
    const onNewMessage = (message) => {
      // console.log('old messages:', messages);
      // console.log('onNewMessage:', message);
      const newArray = [...messages];
      newArray.push(message);
      setMessages(newArray);
      // console.log(newArray.length);
    };

    FirestoreUser.subscribeToMessages(onNewMessage);

    return () => {
      FirestoreUser.unSubscribeToMessages();
    };
  });

  return messages;
}

function textSubmit(e) {
  // console.log(e);
  if (e.code === 'Enter') {
    FirestoreUser.sendMessage({
      content: e.target.value,
      timestamp: 'Now',
      user: 'Third User',
    });
    e.target.value = '';
    e.stopPropagation();
  }
}

function Home() {
  const messages = useMessages();
  // console.log('render: ', messages);

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
          messages.map((message, index) => (
            <Message
              user={message.user}
              timestamp={message.timestamp}
              content={message.content}
              key={`message-${index}`}
            />
          ))
        }
      </MainContent>
      <InputBox>
        <input type="text" placeholder="Message #Channel-name" onKeyUp={textSubmit} />
      </InputBox>
      <UserList>
        UserList
      </UserList>
    </ServerFrame>
  );
}

export default Home;
