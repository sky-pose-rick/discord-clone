const makeServer = (serverKey, serverName, iconURL, altText) => ({
  serverKey, serverName, iconURL, altText, channels: {}, users: {},
});

const makeChannel = (channelKey, channelName, channelDesc, channelRoot) => ({
  channelKey, channelName, channelDesc, channelRoot, messages: [],
});

const makeMessage = (user, timestamp, content, messageKey) => ({
  user, timestamp, content, messageKey,
});

const makeUser = (userKey, userName, iconURL) => ({
  userKey, userName, iconURL,
});

const data = (() => {
  const server1 = makeServer('server-1', 'Server1', '/discord-clone/img/profile2.png', 'SV1');
  server1.users['user-1'] = makeUser('user-1', 'User 1', '/discord-clone/img/profile2.png');
  server1.users['user-2'] = makeUser('user-2', 'User 2', 'gone');
  const channel11 = makeChannel('channel-1', 'Channel-1', 'Speak your Piece.', 'The root of channel 1');
  channel11.messages = [
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
  const channel12 = makeChannel('channel-2', 'Channel-2', 'The alt channel.', 'The root of channel 2');
  channel12.messages = [
    makeMessage('User1', '1:00pm', 'Change the channel!', 'id11'),
  ];
  server1.channels = { 'channel-1': channel11, 'channel-2': channel12 };

  const server2 = makeServer('server-2', 'Server2', 'gone', 'SV2');
  server2.users['user-3'] = makeUser('user-3', 'User 3', 'gone');
  const channel21 = makeChannel('channel-3', 'Cool Zone', 'Coolest place on the coolest server.', 'The Cool Root');
  channel21.messages = [
    makeMessage('User1', '1:00pm', 'Hello World!', 'id101'),
    makeMessage('User1', '1:01pm', 'Me again', 'id102'),
    makeMessage('User2', '1:02pm', 'Replying', 'id103'),
    makeMessage('User1', '1:03pm', 'Final\nMessage\nWith\nMultiple\nLines\n', 'id104'),
    makeMessage('User1', '1:03pm', 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\n', 'id105'),
    makeMessage('User3', '1:04pm', 'more', 'id106'),
    makeMessage('User3', '1:04pm', 'more', 'id107'),
    makeMessage('User3', '1:04pm', '8', 'id108'),
    makeMessage('User3', '1:04pm', '9', 'id109'),
    makeMessage('User3', '1:04pm', '10', 'id110'),
    makeMessage('User3', '1:04pm', '11', 'id111'),
    makeMessage('User3', '1:04pm', '12', 'id112'),
    makeMessage('User3', '1:04pm', '13', 'id113'),
    makeMessage('User3', '1:04pm', '14', 'id114'),
    makeMessage('User3', '1:04pm', '15', 'id115'),
    makeMessage('User3', '1:04pm', '16', 'id116'),
    makeMessage('User3', '1:04pm', '17', 'id117'),
    makeMessage('User3', '1:04pm', '18', 'id118'),
    makeMessage('User3', '1:04pm', '19', 'id119'),
    makeMessage('User1', '1:11pm', '20', 'id120'),
  ];
  server2.channels = { 'channel-3': channel21 };
  return { 'server-1': server1, 'server-2': server2 };
})();

// expecting basic data only
function getServers() {
  const array = Object.values(data);
  const mapping = array.map((server) => {
    const {
      serverKey, serverName, iconURL, altText,
    } = server;
    return {
      serverKey, serverName, iconURL, altText,
    };
  });

  return mapping;
}

function getChannels(serverKey) {
  const server = data[serverKey];
  if (server) {
    const array = Object.values(server.channels);
    const mapping = array.map((channel) => {
      const {
        channelKey, channelName, channelDesc,
      } = channel;
      return {
        channelKey, channelName, channelDesc,
      };
    });

    return mapping;
  }

  return [];
}

function addMessage(serverKey, channelKey, message) {
  const { messages } = data[serverKey].channels[channelKey];
  if (messages) { messages.push(message); }
}

function getMessages(serverKey, channelKey, startingOffset = 0, messageCount = 12) {
  const server = data[serverKey];
  if (server) {
    const channel = server.channels[channelKey];
    if (channel) {
      const { messages } = data[serverKey].channels[channelKey];
      if (messages) {
        const end = messages.length - startingOffset;
        const start = Math.max(0, end - messageCount);
        // console.log(messages);
        // console.log(start, end);
        return messages.slice(start, end);
      }
    }
  }
  return [];
}

function getChannelRoot(serverKey, channelKey) {
  const server = data[serverKey];
  if (server) {
    const channel = server.channels[channelKey];
    if (channel) {
      return channel.channelRoot;
    }
  }
  return 'missing root';
}

export default {
  getServers, getChannels, addMessage, getMessages, getChannelRoot,
};
