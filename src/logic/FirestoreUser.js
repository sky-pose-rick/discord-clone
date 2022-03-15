let messageSubscriber = null;

function sendMessage(message) {
  if (messageSubscriber) {
    messageSubscriber(message);
    // console.log('sent:', message);
  } else {
    console.error('Missing message subscriber');
  }
}

function unSubscribeToMessages() {
  messageSubscriber = null;
  // console.log('Unsubscribed to messages');
}

function subscribeToMessages(onNewMessage) {
  messageSubscriber = onNewMessage;
  // console.log('Got a subscription to messages');
}

export default { sendMessage, unSubscribeToMessages, subscribeToMessages };
