import React, {
  useState, useEffect, useRef,
} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
import uniqid from 'uniqid';
import ServerIcon from './ServerIcon';
import Message from './Message';
import FirestoreUser from '../logic/FirestoreUser';
import FirebaseAuthUser from '../logic/FirebaseAuthUser';
import modalService from '../logic/modalService';

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

function useMessages(channelKey, mainRef) {
  const [messages, setMessages] = useState([]);

  // useEffect needs to be called when state changes in order to update callback
  useEffect(() => {
    const onNewMessage = (message, appendToStart) => {
      const main = mainRef.current;
      const willScroll = main.scrollHeight - main.scrollTop - main.clientHeight < 60;

      setMessages((prev) => {
        // spread to flag a re-render
        const newArray = [...prev];
        if (appendToStart) {
          newArray.unshift(message);
        } else {
          newArray.push(message);
        }
        return newArray;
      });

      // scroll to bottom
      if (willScroll && !appendToStart) {
        main.scroll({ top: main.scrollHeight, behavior: 'instant' });
      }
    };

    const onDeleteMessage = (key) => {
      // don't need to update message content
      setMessages((prev) => {
        const index = prev.findIndex((message) => key === message.messageKey);
        if (index > -1) {
          // spread to flag a re-render
          const newArray = [...prev];
          const newMessage = { ...prev[index] };
          newMessage.deleted = true;
          newArray[index] = newMessage;
          return newArray;
        }
        // if message is not found, make no changes
        return prev;
      });
    };
    const onChangeMessage = () => {};
    const onClearMessages = () => { setMessages([]); };

    FirestoreUser.subscribeToMessages(
      channelKey,
      onNewMessage,
      onChangeMessage,
      onDeleteMessage,
      onClearMessages,
    );

    return () => {
      FirestoreUser.unSubscribeToMessages();
    };
  }, [channelKey]);

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
  }, [serverKey]);

  return channels;
}

function textSubmit(e) {
  // console.log(e);
  const textContent = e.target.value.trim();
  if (e.code === 'Enter' && textContent) {
    const user = FirebaseAuthUser.getUserAuth();
    // console.log(textContent);
    FirestoreUser.sendMessage({
      content: textContent,
      timestamp: 'Now',
      user: user.username,
      messageKey: uniqid(),
    });
    e.target.value = '';
    e.stopPropagation();
  } else if (e.code === 'Enter' && !textContent) {
    e.target.value = '';
    e.stopPropagation();
  }
}

function useMouseWheel(mainRef) {
  const [ticking, setTicking] = useState(false);

  const onWheel = () => {
    if (!ticking) {
      const main = mainRef.current;
      // const { scrollHeight, scrollTop, scrollTopMax } = main;
      // console.log('Height:', scrollHeight, 'Top:', scrollTop, 'Max', scrollTopMax);
      const { scrollTop } = main;
      if (scrollTop < 25) {
        // console.log('new highest scroll:', scrollTop);

        // TODO: try to get new content
        FirestoreUser.loadMoreMessages();
      }

      setTicking(true);
      setTimeout(() => {
        setTicking(false);
      }, 250);
    }
  };

  return onWheel;
}

function Home() {
  const params = useParams();
  const { serverKey, channelKey } = params;
  const mainRef = useRef();

  const servers = useServers();
  const channels = useChannels(serverKey);
  const messages = useMessages(channelKey, mainRef);
  const createModal = modalService.useModal();

  const currentServer = servers.find((server) => server.serverKey === serverKey) || {};
  const currentChannel = channels.find((channel) => channel.channelKey === channelKey) || {};

  const navigate = useNavigate();
  const onContentScroll = useMouseWheel(mainRef);
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
        { /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */ }
        <div
          role="button"
          tabIndex="0"
          onClick={() => {
            createModal([
              {
                type: 'label',
                label: 'Create Server',
                placeholder: 'none',
              },
              {
                type: 'text',
                label: 'Name',
                placeholder: 'new-server',
              },
              {
                type: 'file',
                label: 'Icon',
                placeholder: '',
              },
            ], 'Create');
          }}
        >
          <ServerIcon
            serverName="New Server"
            src="gone"
            alt="create"
          />
        </div>
        <ServerIcon serverName="Find Server" src="gone" alt="browse" />
      </ServerNav>
      <HeaderBar>
        <div className="server-bar">{currentServer.serverName}</div>
        <div className="channel-bar">
          <span className="symbolled">{currentChannel.channelName}</span>
          <div className="line" />
          <span className="channel-desc">{currentChannel.channelDesc}</span>
          <button
            className="edit-server"
            type="button"
            onClick={() => {
              createModal([
                {
                  type: 'label',
                  label: 'Edit Server',
                  placeholder: 'none',
                },
                {
                  type: 'text',
                  label: 'Name',
                  placeholder: currentServer.serverName,
                },
                {
                  type: 'file',
                  label: 'Icon',
                  placeholder: '',
                },
              ], 'Save');
            }}
          >
            Edit Server
          </button>
          <button
            className="delete-server"
            type="button"
            onClick={() => {
              createModal([
                {
                  type: 'label',
                  label: 'Delete Server?',
                  placeholder: 'none',
                },
              ], 'Confirm');
            }}
          >
            Delete Server
          </button>
          <button
            className="edit-channel"
            type="button"
            onClick={() => {
              createModal([
                {
                  type: 'label',
                  label: 'Edit Channel',
                  placeholder: 'none',
                },
                {
                  type: 'text',
                  label: 'Name',
                  placeholder: currentChannel.channelName,
                },
                {
                  type: 'text',
                  label: 'Description',
                  placeholder: currentChannel.channelDesc,
                },
                {
                  type: 'textarea',
                  label: 'Root Message',
                  placeholder: 'need to fetch channel root',
                },
              ], 'Save');
            }}
          >
            Edit Channel
          </button>
          <button
            className="delete-channel"
            type="button"
            onClick={() => {
              createModal([
                {
                  type: 'label',
                  label: 'Delete Channel?',
                  placeholder: 'none',
                },
              ], 'Confirm');
            }}
          >
            Delete Channel
          </button>
        </div>
      </HeaderBar>
      <ChannelNav>
        <button
          className="create-channel"
          type="button"
          onClick={() => {
            createModal([
              {
                type: 'label',
                label: 'Create Channel',
                placeholder: 'none',
              },
              {
                type: 'text',
                label: 'Name',
                placeholder: currentChannel.channelName,
              },
              {
                type: 'text',
                label: 'Description',
                placeholder: currentChannel.channelDesc,
              },
              {
                type: 'textarea',
                label: 'Root Message',
                placeholder: 'need to fetch channel root',
              },
            ], 'Create');
          }}
        >
          Create Channel
        </button>
        {channels.map((channel) => (
          <Link
            to={`/discord-clone/server/${serverKey}/${channel.channelKey}`}
            key={channel.channelKey}
            aria-current={channel.channelKey === channelKey ? 'true' : 'false'}
          >
            <Channel>
              <span className="symbolled">{channel.channelName}</span>
            </Channel>
          </Link>
        ))}
      </ChannelNav>
      <UserPanel onClick={() => {
        createModal([
          {
            type: 'label',
            label: 'Signout?',
            placeholder: 'none',
          },
          {
            type: 'label',
            label: 'Confirm',
            placeholder: 'none',
          },
        ], 'Yes', () => {
          FirebaseAuthUser.logoutUser();
          navigate('/discord-clone/login');
        });
      }}
      >
        User
      </UserPanel>
      <MainContent onWheelCapture={onContentScroll} ref={mainRef}>
        {
          messages.map((message) => (
            <Message
              user={message.user}
              timestamp={message.timestamp}
              content={message.content}
              deleted={message.deleted}
              key={message.messageKey}
              isRoot={message.isRoot}
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
