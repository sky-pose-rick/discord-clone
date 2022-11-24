import {
  getFirestore, collection, getDocs, query, orderBy, limit, onSnapshot,
  addDoc, updateDoc, doc, setDoc,
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
let messageCount = 0;
let rootShown = false;
const messagesToFetch = 12;

function getUserDetails(user) {
  // fetch user from firestore

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

function loadMoreMessages() {
  if (messageSubscriber && activeChannelKey) {
    // console.log('valid channel is active');
    const messages = fakeStorage.getMessages(
      activeServerKey,
      activeChannelKey,
      messageCount,
      messagesToFetch,
    );

    messages.reverse().forEach((message) => {
      displayMessage(message, true);
    });

    messageCount += messages.length;

    if (messages.length < messagesToFetch && !rootShown) {
      const rootMessage = fakeStorage.getChannelRoot(activeServerKey, activeChannelKey);
      displayMessage({
        content: rootMessage,
        messageKey: `${activeChannelKey}-root`,
        isRoot: true,
      }, true);
      rootShown = true;
    }
  }
}

function sendMessage(message) {
  displayMessage(message);
}

function deleteMessage(key) {
  if (!messageSubscriber) {
    console.error('Missing message subscriber');
    return;
  }

  messageSubscriber.onDeleteMessage(key);
}

function unSubscribeToMessages() {
  // should stop listening to firestore snapshots here

  activeChannelKey = null;
  messageCount = 0;
  messageSubscriber = null;
  // console.log('Unsubscribed to messages');
}

function subscribeToMessages(
  channelKey,
  onNewMessage,
  onChangeMessage,
  onDeleteMessage,
  onClearMessages,
) {
  // should start listening to firestore snapshots here

  onClearMessages();
  activeChannelKey = channelKey;
  rootShown = false;
  messageSubscriber = {
    onNewMessage, onChangeMessage, onDeleteMessage, onClearMessages,
  };
  // console.log('Got a subscription to messages');
}

function subscribeToServers(onReplaceServerList) {
  // doesn't actually work because this value won't be overwritten ever
  serverSubscriber = { onReplaceServerList };

  // get current user
  FirebaseAuthUser.getUserAuth().then((user) => {
    // should make some connection to firestore here
    const serverQuery = query(collection(db, 'users', user.uid, 'servers'));
    onSnapshot(serverQuery, (snapshot) => {
      const serverList = [];
      snapshot.forEach((serverDoc) => {
        const data = serverDoc.data();
        const newServer = {
          serverKey: serverDoc.id,
          serverName: data.name,
          iconURL: data.iconURL,
          altText: 'dummy',
        };
        serverList.push(newServer);
      });
      onReplaceServerList(serverList);
    });
  });
}

function unSubscribeToServers() {
  // should stop listening to firestore snapshots here
  serverSubscriber = null;
}

function subscribeToChannels(serverKey, onReplaceChannelList) {
  // should make some connection to firestore here

  activeServerKey = serverKey;
  channelSubscriber = { onReplaceChannelList };
}

function unSubscribeToChannels() {
  // should stop listening to firestore snapshots here

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
        messageCount,
        messagesToFetch,
      );

      // console.log(messages);

      messages.forEach((message) => {
        displayMessage(message);
      });

      messageCount += messages.length;
    }
  }
}

async function createNewServer(owner, name, icon) {
  // create a new document
  const serverRef = await addDoc(collection(db, 'servers'), {
    name,
    iconURL: 'IMAGE_NOT_FOUND',
  });

  // update user's server list
  await setDoc(doc(db, 'users', owner.uid, 'servers', serverRef.id), {});

  // upload the image to storage
  const imageRef = ref(getStorage(), `${serverRef.id}/${icon.name}`);
  const imageSnapshot = await uploadBytesResumable(imageRef, icon);

  // public url for image
  const publicImageURL = await getDownloadURL(imageRef);

  // update server document
  await updateDoc(serverRef, {
    iconURL: publicImageURL,
    storageUri: imageSnapshot.metadata.fullPath,
  });
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
};
