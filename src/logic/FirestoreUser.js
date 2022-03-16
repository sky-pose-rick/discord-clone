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
  messageSubscriber(message);
  // console.log('sent:', message);
}

function sendMessage(message) {
  displayMessage(message);
}

function unSubscribeToMessages() {
  // should stop listening to firestore snapshots here

  messageSubscriber = null;
  // console.log('Unsubscribed to messages');
}

function subscribeToMessages(onNewMessage) {
  // should start listening to firestore snapshots here

  messageSubscriber = onNewMessage;
  // console.log('Got a subscription to messages');
}

export default { sendMessage, unSubscribeToMessages, subscribeToMessages };
