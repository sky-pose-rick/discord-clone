let messageSubscriber = null;

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

export default {
  sendMessage, unSubscribeToMessages, subscribeToMessages, deleteMessage,
};
