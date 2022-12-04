import React from 'react';
import ReactDOM from 'react-dom';
// import FirestoreUser from './logic/FirestoreUser';

import './styles/index.css';
import App from './App';
// import FirebaseAuthUser from './logic/FirebaseAuthUser';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

/* setTimeout(() => {
  console.log('Index tried to push content after 0.75s');
  FirestoreUser.pushFakeContent();
}, 750); */

/* let counter = 0;

document.addEventListener('keyup', (e) => {
  if (e.code === 'Numpad7') {
    console.log('Num 7');
    FirestoreUser.pushFakeContent();
  }

  if (e.code === 'Numpad8') {
    console.log('Num 8');
    counter += 1;
    // console.log(textContent);
    FirestoreUser.sendMessage({
      content: `Sample Message #${counter}`,
      timestamp: 'Now',
      user: 'Third User',
      messageKey: `genned-message-${counter}`,
    });
  }

  if (e.code === 'Numpad3') {
    console.log('Num 3');
    counter += 1;
    // console.log(textContent);
    FirebaseAuthUser.logoutUser();
  }
}); */
