import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

  // useEffect needs to be called when state changes in order to update callback
  useEffect(() => {
    const onNewMessage = (message) => {
      // console.log('old messages:', messages);
      // console.log('onNewMessage:', message);

      setMessages((prev) => {
        // spread to flag a re-render
        const newArray = [...prev];
        newArray.push(message);
        return newArray;
      });
    };

    const onDeleteMessage = (key) => {
      const index = messages.findIndex((message) => key === message.key);

      // don't need to update message content
      if (index > -1) {
        setMessages((prev) => {
          // spread to flag a re-render
          const newArray = [...prev];
          const newMessage = { ...prev[index] };
          newMessage.deleted = true;
          newArray[index] = newMessage;

          return newArray;
        });
      }
    };
    const onChangeMessage = () => {};

    FirestoreUser.subscribeToMessages(onNewMessage, onChangeMessage, onDeleteMessage);

    return () => {
      FirestoreUser.unSubscribeToMessages();
    };
  }, [messages]);

  return messages;
}

function useServers() {
  const [servers, setServers] = useState([]);

  const onReplaceServerList = (list) => {
    const newServers = [...list];
    setServers(newServers);
  };

  useEffect(() => {
    FirestoreUser.subscribeToServers(onReplaceServerList);

    return () => {
      FirestoreUser.unSubscribeToServers();
    };
  }, [servers]);

  return servers;
}

function useChannels(serverKey) {
  const [channels, setChannels] = useState([]);

  const onReplaceChannelList = (list) => {
    const newChannels = [...list];
    setChannels(newChannels);
  };

  useEffect(() => {
    FirestoreUser.subscribeToChannels(serverKey, onReplaceChannelList);

    return () => {
      FirestoreUser.unSubscribeToChannels();
    };
  }, [channels]);

  return channels;
}

function textSubmit(e) {
  // console.log(e);
  const textContent = e.target.value.trim();
  if (e.code === 'Enter' && textContent) {
    // console.log(textContent);
    FirestoreUser.sendMessage({
      content: textContent,
      timestamp: 'Now',
      user: 'Third User',
    });
    e.target.value = '';
    e.stopPropagation();
  } else if (e.code === 'Enter' && !textContent) {
    e.target.value = '';
    e.stopPropagation();
  }
}

function Home() {
  const params = useParams();
  const { serverKey, channelKey } = params;

  const servers = useServers();
  const channels = useChannels(serverKey);
  const messages = useMessages(serverKey, channelKey);

  const navigate = useNavigate();
  // console.log('render: ', messages);

  return (
    <ServerFrame>
      <ServerNav>
        <ServerIcon serverName="Home" src="gone" alt="@me" />
        <div className="line" />
        {servers.map((server) => (
          <Link
            to={`/discord-clone/server/${server.serverKey}/fake-channel`}
            aria-current={server.serverKey === serverKey ? 'true' : 'false'}
            key={server.serverKey}
          >
            <ServerIcon
              serverName={server.serverName}
              src={server.iconURL}
              alt={server.altText}
            />
          </Link>
        ))}
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
        {channels.map((channel) => (
          <Link
            to={`/discord-clone/server/server-1/${channel.channelKey}`}
            key={channel.channelKey}
            aria-current={channel.channelKey === channelKey ? 'true' : 'false'}
          >
            <Channel>
              <span className="symbolled">{channel.channelName}</span>
            </Channel>
          </Link>
        ))}
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
              deleted={message.deleted}
              key={`message-${index}`}
            />
          ))
        }
      </MainContent>
      <InputBox>
        <textarea type="text" placeholder="Message #Channel-name" onKeyUp={textSubmit} />
      </InputBox>
      <UserList>
        UserList
      </UserList>
    </ServerFrame>
  );
}

export default Home;
