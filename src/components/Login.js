/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStyles from '../component-styles/RegisterStyles';
import FirebaseAuthUser from '../logic/FirebaseAuthUser';

const {
  FormBox,
  FormH1,
  LabelWrapper,
  InputWrapper,
  FormInput,
} = RegisterStyles;

function Login() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    // console.table(e.target);

    const email = form[0].value;
    const password = form[1].value;

    FirebaseAuthUser.signInUser(email, password, () => {
      navigate('/server/@me');
    });
  };

  return (
    <FormBox>
      <FormH1>Welcome Back!</FormH1>
      <h2>We&apos;re so excited to see you again!</h2>
      <form action="" onSubmit={onSubmit}>
        <div className="input-wrapper">
          <LabelWrapper>
            <label htmlFor="login-email">EMAIL</label>
            <InputWrapper><FormInput name="email" id="login-email" type="email" required /></InputWrapper>
          </LabelWrapper>
        </div>
        <div className="input-wrapper">
          <LabelWrapper>
            <label htmlFor="login-password">PASSWORD</label>
            <InputWrapper>
              <FormInput name="password" id="login-password" type="password" required />
            </InputWrapper>
          </LabelWrapper>
        </div>
        {/* <div>Forgot your password?</div> */}
        <button type="submit">Login</button>
      </form>
      <div>
        Need an account?
        <a href="/register">Register</a>
      </div>
    </FormBox>
  );
}

export default Login;
