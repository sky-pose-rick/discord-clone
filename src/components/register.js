/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

function Register() {
  return (
    <div className="Register">
      <h1>Create an account</h1>
      <form action="" method="POST">
        <div className="input-wrapper">
          <label htmlFor="register-email">EMAIL</label>
          <input name="email" id="register-email" type="email" required />
        </div>
        <div className="input-wrapper">
          <label htmlFor="register-username">USERNAME</label>
          <input name="username" id="register-username" type="text" required />
        </div>
        <div className="input-wrapper">
          <label htmlFor="register-password">PASSWORD</label>
          <input name="password" id="register-password" type="password" required />
        </div>
        {/* Nice to have: custom date selector */}
        <div className="input-wrapper">
          <label htmlFor="register-month">DATE OF BIRTH</label>
          <input name="register-month" type="text" required />
          <input name="register-day" type="text" required />
          <input name="register-year" type="text" required />
        </div>
        <button type="submit">Continue</button>
      </form>
      <div>
        <a href="./login">Already have an account?</a>
      </div>
      <div className="policy">
        By registering, you agree to not make a mess of this project.
      </div>
    </div>
  );
}

export default Register;
