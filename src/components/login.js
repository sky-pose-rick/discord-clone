/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

function Login() {
  return (
    <div className="Login">
      <h1>Welcome Back!</h1>
      <h2>We&apos;re so excited to see you again!</h2>
      <form action="" method="POST">
        <div className="input-wrapper">
          <label htmlFor="login-username">USERNAME</label>
          <input name="username" id="login-username" type="text" required />
        </div>
        <div className="input-wrapper">
          <label htmlFor="login-password">PASSWORD</label>
          <input name="password" id="login-password" type="text" required />
        </div>
        {/* <div>Forgot your password?</div> */}
        <button type="submit">Login</button>
        <div>
          Need an account?
          <a href="./register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
