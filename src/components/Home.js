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
import modals from '../logic/modals';
import ServerBrowser from './ServerBrowser';

import ServerStyles from '../component-styles/ServerStyles';

function useMessages(channelKey, mainRef, willShowContent) {
  const [messages, setMessages] = useState([]);

  // useEffect needs to be called when state changes in order to update callback
  useEffect(() => {
    if (willShowContent) {
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
    }
    setMessages([]);
    return () => {};
  }, [channelKey, willShowContent]);

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

function useChannels(serverKey, willShowContent) {
  const [channels, setChannels] = useState([]);

  const onReplaceChannelList = (list) => {
    const newChannels = [...list];
    setChannels(newChannels);
  };

  useEffect(() => {
    if (willShowContent) {
      FirestoreUser.subscribeToChannels(serverKey, onReplaceChannelList);

      return () => {
        FirestoreUser.unSubscribeToChannels();
      };
    }
    setChannels([]);
    return () => {};
  }, [serverKey, willShowContent]);

  return channels;
}

function useUser() {
  const [user, setUser] = useState({
    displayName: 'Loading',
    iconURL: 'missing',
    uid: 'missing',
  });

  useEffect(() => {
    const userPromise = FirestoreUser.getSelf();

    userPromise.then((data) => {
      setUser(data);
    });
  }, []);

  return {
    ...user,
    setUser,
  };
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

function useMouseWheel(mainRef, willShowContent) {
  const [ticking, setTicking] = useState(false);

  if (!willShowContent) {
    return () => {};
  }

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

  const isHome = serverKey === '@me';
  const isBrowser = serverKey === '@browse';
  const mainRef = useRef();

  const servers = useServers();
  const channels = useChannels(serverKey, !(isHome || isBrowser));

  const messages = useMessages(channelKey, mainRef, !(isHome || isBrowser));
  const currentUser = useUser();

  const willShowContent = !(isHome || isBrowser);

  const navigate = useNavigate();

  let currentServer = servers.find((server) => server.serverKey === serverKey) || {};
  if (isBrowser) {
    currentServer = {
      serverKey: 'dummy-server',
      serverName: 'Browse',
    };
  } else if (isHome) {
    currentServer = {
      serverKey: 'dummy-server',
      serverName: 'Home',
    };
  } else if (servers.length > 0 && !currentServer.serverKey) {
    // detect invalid server key
    // fails if user has left all servers

    // move to @me page
    navigate('/discord-clone/server/@me');
  }
  let currentChannel = channels.find((channel) => channel.channelKey === channelKey) || {};
  if (isBrowser) {
    currentChannel = {
      channelKey: 'dummy-server',
      channelName: 'Browse',
      channelDesc: 'Join an existing server',
    };
  } else if (isHome) {
    currentChannel = {
      channelKey: 'dummy-server',
      channelName: 'Home',
      channelDesc: 'Your home page',
    };
  } else if (channels.length > 0 && !currentChannel.channelKey) {
    // detect invalid channel key

    // move to first channel
    navigate(`/discord-clone/server/${currentServer.serverKey}/${channels[0].channelKey}`);
  }

  const onContentScroll = useMouseWheel(mainRef, willShowContent);
  // console.log('render: ', messages);
  // console.log(currentUser);

  return (
    <ServerStyles.ServerFrame>
      <ServerStyles.ServerNav>
        <Link
          to="/discord-clone/server/@me"
          aria-current={isHome}
          key="@me"
        >
          <ServerIcon serverName="Home" src="gone" alt="@me" />
        </Link>

        <div className="line" />
        {servers.map((server) => (
          <Link
            to={`/discord-clone/server/${server.serverKey}`}
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
            modals.createServerModal(currentUser, (nextServerkey, nextChannelKey) => {
              navigate(`/discord-clone/server/${nextServerkey}/${nextChannelKey}`);
            });
          }}
        >
          <ServerIcon
            serverName="New Server"
            src="gone"
            alt="create"
          />
        </div>
        <Link
          to="/discord-clone/server/@browse"
          aria-current={isBrowser}
          key="@browse"
        >
          <ServerIcon serverName="Find Server" src="gone" alt="Browse" />
        </Link>
      </ServerStyles.ServerNav>
      <ServerStyles.HeaderBar>
        <div className="server-bar">{currentServer.serverName}</div>
        <div className="channel-bar">
          <span className="symbolled">{currentChannel.channelName}</span>
          <div className="line" />
          <span className="channel-desc">{currentChannel.channelDesc}</span>
          {willShowContent && (currentServer.owner === currentUser.uid) && (
          <button
            className="edit-server"
            type="button"
            onClick={() => {
              modals.editServerModal(currentServer);
            }}
          >
            Edit Server
          </button>
          )}
          {willShowContent && (currentServer.owner === currentUser.uid) && (
          <button
            className="delete-server"
            type="button"
            onClick={() => {
              modals.deleteServerModal(currentServer, () => {
                navigate('/discord-clone/server/@me');
              });
            }}
          >
            Delete Server
          </button>
          ) }
          {willShowContent && (currentServer.owner !== currentUser.uid) && (
          <button
            className="leave-server"
            type="button"
            onClick={() => {
              modals.leaveServerModal(currentServer, currentUser, () => {
                navigate('/discord-clone/server/@me');
              });
            }}
          >
            Leave Server
          </button>
          ) }
          {willShowContent && (currentServer.owner === currentUser.uid) && (
          <button
            className="edit-channel"
            type="button"
            onClick={() => {
              modals.editChannelModal(currentChannel);
            }}
          >
            Edit Channel
          </button>
          )}
          {willShowContent && (currentServer.owner === currentUser.uid) && (
          <button
            className="delete-channel"
            type="button"
            onClick={() => {
              modals.deleteChannelModal(
                currentChannel,
                channels,
                (nextServerkey, nextChannelKey) => {
                  navigate(`/discord-clone/server/${nextServerkey}/${nextChannelKey}`);
                },
              );
            }}
          >
            Delete Channel
          </button>
          )}
          <button
            className="signout"
            type="button"
            onClick={() => {
              modals.signOutModal(() => {
                navigate('/discord-clone/login');
              });
            }}
          >
            Log Out
          </button>
        </div>
      </ServerStyles.HeaderBar>
      <ServerStyles.ChannelNav>
        {(currentServer.owner === currentUser.uid) && (
        <button
          className="create-channel"
          type="button"
          onClick={() => {
            modals.createChannelModal(currentServer, (nextServerkey, nextChannelKey) => {
              navigate(`/discord-clone/server/${nextServerkey}/${nextChannelKey}`);
            });
          }}
        >
          Create Channel
        </button>
        )}
        {channels.map((channel) => (
          <Link
            to={`/discord-clone/server/${serverKey}/${channel.channelKey}`}
            key={channel.channelKey}
            aria-current={channel.channelKey === channelKey ? 'true' : 'false'}
          >
            <ServerStyles.Channel>
              <span className="symbolled">{channel.channelName}</span>
            </ServerStyles.Channel>
          </Link>
        ))}
      </ServerStyles.ChannelNav>
      <ServerStyles.UserPanel onClick={() => {
        modals.editUserModal(currentUser, (updatedUser) => {
          currentUser.setUser(updatedUser);
        });
      }}
      >
        <img src={currentUser.icon} alt="U" />
        <span>{currentUser.displayName}</span>
      </ServerStyles.UserPanel>
      {willShowContent && (
      <ServerStyles.MainContent onWheelCapture={onContentScroll} ref={mainRef}>
        {
          messages.map((message) => (
            <Message
              user={message.user}
              timestamp={message.timestamp}
              content={message.content}
              deleted={message.deleted}
              key={message.messageKey}
              isRoot={message.isRoot}
              isModerator
              deleteFunc={() => {
                modals.deleteMessageModal(currentChannel, message);
              }}
            />
          ))
        }
      </ServerStyles.MainContent>
      )}
      {!willShowContent && (
      <ServerStyles.BlankMain>
        {isBrowser && <ServerBrowser userKey={currentUser.uid} />}
      </ServerStyles.BlankMain>
      )}
      {willShowContent && (
      <ServerStyles.InputBox>
        <textarea type="text" placeholder={`Message #${currentChannel.channelName}`} onKeyUp={textSubmit} />
      </ServerStyles.InputBox>
      )}
      <ServerStyles.UserList>
        {willShowContent && <div>UserList</div>}
      </ServerStyles.UserList>
    </ServerStyles.ServerFrame>
  );
}

export default Home;
