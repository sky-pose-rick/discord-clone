let messageSubscriber = null;
let serverSubscriber = null;
let channelSubscriber = null;

function displayMessage(message) {
  if (!messageSubscriber) {
    console.error('Missing message subscriber');
    return;
  }
  if (!message.content) {
    console.error('Blank message submitted');
    return;
  }
  messageSubscriber.onNewMessage(message);
  // console.log('sent:', message);
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

  messageSubscriber = null;
  // console.log('Unsubscribed to messages');
}

function subscribeToMessages(onNewMessage, onChangeMessage, onDeleteMessage) {
  // should start listening to firestore snapshots here

  messageSubscriber = { onNewMessage, onChangeMessage, onDeleteMessage };
  // console.log('Got a subscription to messages');
}

function subscribeToServers(onReplaceServerList) {
  // should make some connection to firestore here

  serverSubscriber = { onReplaceServerList };
}

function unSubscribeToServers() {
  // should stop listening to firestore snapshots here

  serverSubscriber = null;
}

function subscribeToChannels(serverKey, onReplaceChannelList) {
  // should make some connection to firestore here

  channelSubscriber = { onReplaceChannelList };
}

function unSubscribeToChannels() {
  // should stop listening to firestore snapshots here

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
    const makeMessage = (user, timestamp, content, key) => ({
      user, timestamp, content, key,
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
};
