import {
  getFirestore, collection, getDocs, query, orderBy, limit, onSnapshot,
  addDoc, updateDoc, doc, setDoc, getDoc, serverTimestamp, startAfter, deleteDoc,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import fakeStorage from './fakeStorage';
import FirebaseAuthUser from './FirebaseAuthUser';

const db = getFirestore();

let messageSubscriber = null;
let serverSubscriber = null;
let channelSubscriber = null;
let activeChannelKey = null;
let activeServerKey = null;
let messageCursor = null;
let rootShown = false;
const messagesToFetch = 12;

function getUserDetails(user) {
  // fetch user from firestore

}

function makeChannelDoc(serverKey, channelKey) {
  return doc(db, 'servers', serverKey, 'channels', channelKey);
}

function makeServerDoc(serverKey) {
  return doc(db, 'servers', serverKey);
}

function displayMessage(message, appendToStart) {
  if (!messageSubscriber) {
    console.error('Missing message subscriber');
    return;
  }
  if (!message.content) {
    console.error('Blank message submitted');
    return;
  }
  messageSubscriber.onNewMessage(message, appendToStart);
  // console.log('sent:', message);
}

async function loadMoreMessages() {
  if (messageSubscriber && activeChannelKey && !rootShown) {
    // adjust to use a cursor later
    const channelDoc = makeChannelDoc(activeServerKey, activeChannelKey);
    const messageColl = collection(channelDoc, 'messages');
    let messageQuery;
    if (messageCursor && !messageCursor.data().timestamp) {
      messageCursor = await getDoc(doc(messageColl, messageCursor.id));
    }
    if (messageCursor) {
      messageQuery = query(messageColl, orderBy('timestamp', 'desc'), limit(messagesToFetch), startAfter(messageCursor));
    } else {
      messageQuery = query(messageColl, orderBy('timestamp', 'desc'), limit(messagesToFetch));
    }

    const messageBatch = await (getDocs(messageQuery));
    const messagesFetched = messageBatch.docs.length;
    messageBatch.forEach((message) => {
      const data = message.data();
      // console.log(data.timestamp);
      const newMessage = {
        user: data.user,
        timestamp: `${data.timestamp.seconds} `,
        content: data.content,
        messageKey: message.id,
        deleted: !!message.deleted,
      };
      displayMessage(newMessage, true);
    });
    if (messagesFetched > 0) {
      messageCursor = messageBatch.docs[messagesFetched - 1];
    }

    if (messagesFetched < messagesToFetch) {
      // fetch the channel root from firestore

      const channelRef = await getDoc(channelDoc);
      const channelData = channelRef.data();
      if (channelData) {
        displayMessage({
          content: channelData.root,
          messageKey: `${activeChannelKey}-root`,
          isRoot: true,
        }, true);
        rootShown = true;
      }
    }
  }
}

async function sendMessage(message) {
  // need to create a new document for this message
  // console.log('new message', activeServerKey, activeChannelKey);
  const messageColl = collection(db, 'servers', activeServerKey, 'channels', activeChannelKey, 'messages');
  const messageObj = {
    user: message.user,
    timestamp: serverTimestamp(),
    content: message.content,
  };

  await addDoc(messageColl, messageObj);
}

async function deleteMessage(serverKey, channelKey, messageKey) {
  const channelDoc = makeChannelDoc(serverKey, channelKey);
  const messageDoc = doc(channelDoc, 'messages', messageKey);

  await updateDoc(messageDoc, {
    content: '',
    deleted: 'true',
  });

  messageSubscriber.onDeleteMessage(messageKey);
}

function unSubscribeToMessages() {
  // should stop listening to firestore snapshots here

  activeChannelKey = null;

  if (messageSubscriber.unsub) {
    messageSubscriber.unsub();
  }

  messageSubscriber = null;
  // console.log('Unsubscribed to messages');
}

async function subscribeToMessages(
  channelKey,
  onNewMessage,
  onChangeMessage,
  onDeleteMessage,
  onClearMessages,
) {
  onClearMessages();
  activeChannelKey = channelKey;
  rootShown = false;
  messageCursor = null;

  messageSubscriber = {
    onNewMessage, onChangeMessage, onDeleteMessage, onClearMessages,
  };

  // should start listening to firestore snapshots here
  const messageColl = collection(db, 'servers', activeServerKey, 'channels', activeChannelKey, 'messages');
  // ignores changes/deletes that are not recent
  const messageQuery = query(messageColl, orderBy('timestamp', 'desc'), limit(messagesToFetch));
  const unsub = onSnapshot(messageQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // new message
        const data = change.doc.data();
        const newMessage = {
          user: data.user,
          timestamp: (data.timestamp) ? `${data.timestamp.seconds} ` : 'now',
          content: data.content,
          deleted: !!data.deleted,
          messageKey: change.doc.id,
        };

        // compare to message cursor
        if (messageCursor) {
          const cursorTimestamp = messageCursor.data().timestamp;
          const newTimestamp = data.timestamp;
          if (newTimestamp
            && ((cursorTimestamp.seconds === newTimestamp.seconds
                && cursorTimestamp.nanoseconds > newTimestamp.nanoseconds)
              || (cursorTimestamp.seconds > newTimestamp.seconds))) {
            messageCursor = change.doc;
            onNewMessage(newMessage, true);
          } else { onNewMessage(newMessage, false); }
        } else {
          onNewMessage(newMessage, false);
          messageCursor = change.doc;
        }
      }
      if (change.type === 'modified') {
        // test if this message is flagged as deleted
        if (change.doc.data.deleted) {
          onDeleteMessage(change.doc.id);
        }
      }
      if (change.type === 'removed') {
        // manually removed from database
        onDeleteMessage(change.doc.id);
      }
    });
  });

  channelSubscriber.unsub = unsub;
  // console.log('Got a subscription to messages');
}

function subscribeToServers(onReplaceServerList) {
  serverSubscriber = { onReplaceServerList };

  // get current user
  FirebaseAuthUser.getUserAuth().then((user) => {
    // should make some connection to firestore here
    // find list of servers the user is subscribed to
    const serverQuery = query(collection(db, 'users', user.uid, 'servers'));
    const unsub = onSnapshot(serverQuery, (snapshot) => {
      const serverList = [];
      snapshot.forEach(async (serverID) => {
        // need to grab server from server list

        const serverRef = doc(db, 'servers', serverID.id);
        const serverDoc = await getDoc(serverRef);
        const serverData = serverDoc.data();
        // filter out any subscribed servers that have been deleted from firestore
        if (serverData) {
          // get a channel from the server
          if (!serverData.defaultChannel) {
            const channelQuery = query(collection(serverRef, 'channels'), limit(1));
            const channelDocs = await getDocs(channelQuery);
            if (channelDocs.docs[0]) {
              serverData.defaultChannel = channelDocs.docs[0].id;
            }
          }

          const newServer = {
            serverKey: serverDoc.id,
            serverName: serverData.name,
            iconURL: serverData.iconURL,
            altText: serverData.name.slice(0, 3).toUpperCase(),
            defaultChannel: serverData.defaultChannel,
          };
          serverList.push(newServer);
          // call here because foreach loop is not waited for
          onReplaceServerList(serverList);
        }
      });
    });

    serverSubscriber.unsub = unsub;
  });
}

function unSubscribeToServers() {
  // should stop listening to firestore snapshots here
  if (serverSubscriber.unsub) {
    serverSubscriber.unsub();
  }

  serverSubscriber = null;
}

function subscribeToChannels(serverKey, onReplaceChannelList) {
  channelSubscriber = { onReplaceChannelList };
  // should make some connection to firestore here
  activeServerKey = serverKey;
  // fetch all channels from serverkey
  const channelQuery = query(collection(db, 'servers', serverKey, 'channels'));
  const unsub = onSnapshot(channelQuery, (snapshot) => {
    const channelList = [];
    snapshot.forEach(async (channelDoc) => {
      // need to grab server from server list
      const channelData = channelDoc.data();
      // check that the channel has some associated data
      if (channelData) {
        const newChannel = {
          channelKey: channelDoc.id,
          channelName: channelData.name,
          channelDesc: channelData.desc,
          channelRoot: channelData.root,
          serverKey,
        };
        channelList.push(newChannel);
        // call here because foreach loop is not waited for
        onReplaceChannelList(channelList);
      }
    });
  });

  channelSubscriber.unsub = unsub;
}

function unSubscribeToChannels() {
  // should stop listening to firestore snapshots here
  if (channelSubscriber.unsub) {
    channelSubscriber.unsub();
  }

  activeServerKey = null;
  channelSubscriber = null;
}

function pushTestContent() {
  if (serverSubscriber) {
    const makeServer = (serverKey, serverName, iconURL, altText) => ({
      serverKey, serverName, iconURL, altText,
    });

    const fakeServerList = [
      makeServer('server-1', 'Server1', '/discord-clone/img/profile2.png', 'SV1'),
      makeServer('server-2', 'Server2', 'gone', 'SV2'),
      makeServer('server-7', 'Server7', '/discord-clone/img/profile2.png', 'SV7'),
      makeServer('server-8', 'Server8', 'gone', 'SV8'),
    ];

    serverSubscriber.onReplaceServerList(fakeServerList);
  }

  if (channelSubscriber) {
    const makeChannel = (channelKey, channelName, channelDesc) => ({
      channelKey, channelName, channelDesc,
    });

    const fakeChannelList = [
      makeChannel('channel-1', 'Channel-1', 'Speak your Piece.'),
      makeChannel('channel-2', 'Channel-2', 'Speak to Peace.'),
      makeChannel('channel-3', 'Channel-3', 'Speak of Pizza.'),
      makeChannel('channel-4', 'Channel-4', 'Spike Peez.'),
      makeChannel('channel-5', 'Channel-5', 'Piece your Speak.'),
    ];

    channelSubscriber.onReplaceChannelList(fakeChannelList);
  }

  if (messageSubscriber) {
    const makeMessage = (user, timestamp, content, messageKey) => ({
      user, timestamp, content, messageKey,
    });

    const messages = [
      makeMessage('User1', '1:00pm', 'Hello World!', 'id1'),
      makeMessage('User1', '1:01pm', 'Me again', 'id2'),
      makeMessage('User2', '1:02pm', 'Replying', 'id3'),
      makeMessage('User1', '1:03pm', 'Final\nMessage\nWith\nMultiple\nLines\n', 'id4'),
      makeMessage('User1', '1:03pm', 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\n', 'id5'),
      makeMessage('User3', '1:04pm', 'more', 'id6'),
      makeMessage('User3', '1:04pm', 'more', 'id7'),
      makeMessage('User3', '1:04pm', 'more', 'id8'),
      makeMessage('User3', '1:04pm', 'more', 'id9'),
      makeMessage('User3', '1:04pm', 'more', 'id10'),
    ];

    messages.forEach((message) => {
      displayMessage(message);
    });
  }
}

function pushFakeContent() {
  if (serverSubscriber) {
    serverSubscriber.onReplaceServerList(fakeStorage.getServers());
  }

  if (activeServerKey) {
    if (channelSubscriber) {
      channelSubscriber.onReplaceChannelList(fakeStorage.getChannels(activeServerKey));
    }
    // console.log('valid server is active');

    if (messageSubscriber && activeChannelKey) {
      // console.log('valid channel is active');
      const messages = fakeStorage.getMessages(
        activeServerKey,
        activeChannelKey,
        messagesToFetch,
      );

      // console.log(messages);

      messages.forEach((message) => {
        displayMessage(message);
      });
    }
  }
}

async function createNewChannel(serverKey, name, desc, root) {
  const serverDoc = makeServerDoc(serverKey);
  const channelDoc = await addDoc(collection(serverDoc, 'channels'), { name, desc, root });
  return channelDoc.id;
}

async function updateChannel(serverKey, channelKey, name, desc, root) {
  const channelDoc = makeChannelDoc(serverKey, channelKey);
  updateDoc(channelDoc, {
    name,
    desc,
    root,
  });
}

async function deleteChannel(serverKey, channelKey) {
  const channelDoc = makeChannelDoc(serverKey, channelKey);
  deleteDoc(channelDoc);
}

async function createNewServer(owner, name, icon) {
  // create a new document
  const serverRef = await addDoc(collection(db, 'servers'), {
    name,
    iconURL: 'IMAGE_NOT_FOUND',
  });

  // update user's server list
  await setDoc(doc(db, 'users', owner.uid, 'servers', serverRef.id), {});

  // create a welcome channel
  const channelID = await createNewChannel(serverRef.id, 'Welcome', 'The welcome channel', 'Welcome to the server');

  // upload the image to storage
  const imageRef = ref(getStorage(), `${serverRef.id}/${icon.name}`);
  const imageSnapshot = await uploadBytesResumable(imageRef, icon);

  // public url for image
  const publicImageURL = await getDownloadURL(imageRef);

  // update server document
  await updateDoc(serverRef, {
    iconURL: publicImageURL,
    storageUri: imageSnapshot.metadata.fullPath,
    defaultChannel: channelID,
  });

  const newServer = {
    serverKey: serverRef.id,
    channelKey: channelID,
  };
  return newServer;
}

async function updateServer(serverKey, name, icon) {
  const serverDoc = makeServerDoc(serverKey);

  if (icon) {
    // upload new image to storage
    const imageRef = ref(getStorage(), `${serverKey}/${icon.name}`);
    const imageSnapshot = await uploadBytesResumable(imageRef, icon);

    // public url for image
    const publicImageURL = await getDownloadURL(imageRef);

    // update server document
    await updateDoc(serverDoc, {
      name,
      iconURL: publicImageURL,
      storageUri: imageSnapshot.metadata.fullPath,
    });
  } else {
    await updateDoc(serverDoc, {
      name,
    });
  }
}

export default {
  sendMessage,
  deleteMessage,
  subscribeToMessages,
  unSubscribeToMessages,
  subscribeToChannels,
  unSubscribeToChannels,
  subscribeToServers,
  unSubscribeToServers,
  pushTestContent,
  pushFakeContent,
  loadMoreMessages,
  createNewServer,
  updateChannel,
  createNewChannel,
  updateServer,
  deleteChannel,
};
