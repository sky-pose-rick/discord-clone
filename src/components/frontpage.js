import React from 'react';
import Login from './login';
import Register from './register';

function LoginRegister() {
  return (
    <div className="login-wrapper">
      {false && <Login />}
      <Register />
    </div>
  );
}

export default LoginRegister;
