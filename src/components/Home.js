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
import UserList from './UserList';

import ServerStyles from '../component-styles/ServerStyles';

function useMessages(channelKey, mainRef, willShowContent) {
  const [messages, setMessages] = useState([]);

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

function useUser(currentServer, willShowContent) {
  const serverKey = (currentServer) ? currentServer.serverKey : 'dummy-server';

  // uid from firestore auth
  const [userKey, setUserKey] = useState('0');

  useEffect(() => {
    const userPromise = FirestoreUser.getSelf();

    userPromise.then((data) => {
      setUserKey(data.uid);
    });
  }, []);

  // userDetails from user collection
  const [userDetails, setUserDetails] = useState({
    uid: userKey,
    name: 'missing',
    icon: 'blank.png',
  });

  useEffect(() => {
    const unsub = FirestoreUser.subscribeToUserSelf(userKey, (details) => {
      setUserDetails(details);
    });

    return unsub;
  }, [userKey]);

  // userDetails from server collection
  const [userInServer, setUserInServer] = useState({
    isOwner: false,
    isModerator: false,
    isAdmin: false,
  });

  useEffect(() => {
    if (!willShowContent) {
      setUserInServer({
        isOwner: false,
        isModerator: false,
        isAdmin: false,
      });
      return () => {};
    }
    const unsub = FirestoreUser.subscribeToSelfInServer(
      userKey,
      serverKey,
      (details) => {
        setUserInServer({
          ...details,
          isOwner: userKey === currentServer.owner,
        });
      },
    );

    return unsub;
  }, [userKey, serverKey]);

  return {
    ...userDetails,
    ...userInServer,
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

  let willShowContent = !(isHome || isBrowser);

  const navigate = useNavigate();

  let currentServer = servers.find((server) => server.serverKey === serverKey) || {
    serverKey: serverKey || 'bad-key',
    serverName: 'Loading',
    iconURL: 'Missing',
    altText: 'LDG',
    owner: 'X',

  };
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
  } else if (!currentServer.serverKey) {
    // detect invalid server key
    // hide content
    willShowContent = false;
  }

  const currentUser = useUser(currentServer, willShowContent);

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
  } else if (!currentChannel.channelKey) {
    // detect invalid channel key
    // do not render
    willShowContent = false;
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
          <ServerIcon serverName="Home" src="gone" alt="@me" serverActive={isHome} isDefault />
        </Link>

        <div className="line" />
        {servers.map((server) => (
          <Link
            to={`/discord-clone/server/${server.serverKey}`}
            aria-current={server.serverKey === serverKey}
            key={server.serverKey}
          >
            <ServerIcon
              serverName={server.serverName}
              src={server.iconURL}
              alt={server.altText}
              serverActive={server.serverKey === serverKey}
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
            alt="Create"
            isDefault
          />
        </div>
        <Link
          to="/discord-clone/server/@browse"
          aria-current={isBrowser}
          key="@browse"
        >
          <ServerIcon
            serverName="Find Server"
            src="gone"
            alt="Browse"
            serverActive={isBrowser}
            isDefault
          />
        </Link>
      </ServerStyles.ServerNav>
      <ServerStyles.HeaderBar>
        <div className="server-bar">{currentServer.serverName}</div>
        <div className="channel-bar">
          <span className="symbolled">{currentChannel.channelName}</span>
          <div className="line" />
          <span className="channel-desc">{currentChannel.channelDesc}</span>
          {willShowContent && (currentUser.isOwner || currentUser.isAdmin) && (
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
          {willShowContent && (currentUser.isOwner) && (
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
          {willShowContent && (!currentUser.isOwner) && (
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
          {willShowContent && (currentUser.isOwner || currentUser.isAdmin) && (
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
          {willShowContent && (currentUser.isOwner || currentUser.isAdmin) && (
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
        {(currentUser.isOwner || currentUser.isAdmin) && (
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
        modals.editUserModal(currentUser);
      }}
      >
        <img src={currentUser.icon} alt="U" />
        <span>{currentUser.name}</span>
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
              isModerator={currentUser.isOwner || currentUser.isAdmin || currentUser.isModerator}
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
        {willShowContent && (
        <UserList
          serverKey={currentServer.serverKey}
          selfKey={currentUser.uid}
        />
        )}
      </ServerStyles.UserList>
    </ServerStyles.ServerFrame>
  );
}

export default Home;
