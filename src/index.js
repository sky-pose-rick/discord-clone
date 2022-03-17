import React from 'react';
import ReactDOM from 'react-dom';
import FirestoreUser from './logic/FirestoreUser';
import './styles/index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

setTimeout(() => {
  console.log('Index tried to push content after 0.75s');
  FirestoreUser.pushTestContent();
}, 750);
