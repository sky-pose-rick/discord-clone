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
import modals from '../logic/modals';

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
  }, []);

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

function useUser() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userPromise = FirebaseAuthUser.getUserAuth();

    userPromise.then((data) => {
      setUser(data);
    });
  }, []);

  return user;
}

function textSubmit(e) {
  // console.log(e);
  const textContent = e.target.value.trim();
  if (e.code === 'Enter' && textContent) {
    const userPromise = FirebaseAuthUser.getUserAuth();
    userPromise.then((data) => {
      // console.log(textContent);
      FirestoreUser.sendMessage({
        content: textContent,
        timestamp: 'Now',
        user: data.uid,
        messageKey: uniqid(),
      });
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
      }, 1250);
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
  const currentUser = useUser();

  const currentServer = servers.find((server) => server.serverKey === serverKey) || {};
  const currentChannel = channels.find((channel) => channel.channelKey === channelKey) || {};

  const navigate = useNavigate();
  const onContentScroll = useMouseWheel(mainRef);
  // console.log('render: ', messages);
  // console.log(currentUser);

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
            modals.createServerModal(currentUser, (newServerKey, newChannelKey) => {
              navigate(`/discord-clone/server/${newServerKey}/${newChannelKey}`);
            });
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
              modals.editServerModal(currentServer);
            }}
          >
            Edit Server
          </button>
          <button
            className="delete-server"
            type="button"
            onClick={() => {
              modals.deleteServerModal(currentServer);
            }}
          >
            Delete Server
          </button>
          <button
            className="edit-channel"
            type="button"
            onClick={() => {
              modals.editChannelModal(currentChannel);
            }}
          >
            Edit Channel
          </button>
          <button
            className="delete-channel"
            type="button"
            onClick={() => {
              modals.deleteChannelModal(currentChannel);
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
            modals.createChannelModal(currentServer);
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
        modals.signOutModal(() => {
          navigate('/discord-clone/login');
        });
      }}
      >
        { currentUser && currentUser.displayName }
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
        <textarea type="text" placeholder={`Message #${currentChannel.channelName}`} onKeyUp={textSubmit} />
      </InputBox>
      <UserList>
        UserList
      </UserList>
    </ServerFrame>
  );
}

export default Home;
