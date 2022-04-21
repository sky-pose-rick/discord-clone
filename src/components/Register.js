/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import RegisterStyles from '../component-styles/RegisterStyles';

const {
  FormBox,
  FormH1,
  LabelWrapper,
  InputWrapper,
  FormInput,
} = RegisterStyles;

function Register() {
  return (
    <FormBox>
      <FormH1>Create an account</FormH1>
      <form action="">
        <LabelWrapper>
          <label htmlFor="register-email">EMAIL</label>
          <InputWrapper><FormInput name="email" id="register-email" type="email" required /></InputWrapper>
        </LabelWrapper>
        <LabelWrapper>
          <label htmlFor="register-username">USERNAME</label>
          <InputWrapper><FormInput name="username" id="register-username" type="text" required /></InputWrapper>
        </LabelWrapper>
        <LabelWrapper className="input-wrapper">
          <label htmlFor="register-password">PASSWORD</label>
          <InputWrapper><FormInput name="password" id="register-password" type="password" required /></InputWrapper>
        </LabelWrapper>
        {/* Nice to have: custom date selector */}
        <LabelWrapper className="input-wrapper">
          <label htmlFor="register-month">DATE OF BIRTH</label>
          <InputWrapper>
            <FormInput name="register-month" type="text" required />
            <FormInput name="register-day" type="text" required />
            <FormInput name="register-year" type="text" required />
          </InputWrapper>
        </LabelWrapper>
        <button type="submit">Continue</button>
      </form>
      <div>
        <a href="./login">Already have an account?</a>
      </div>
      <div className="policy">
        By registering, you agree to not make a mess of this project.
      </div>
    </FormBox>
  );
}

export default Register;
