/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from 'styled-components';

const FormBox = styled.div`{
  background-color: #363940;
  color: #9c9fa6;
  margin: 20px 20px;
  padding: 10px 40px;
  width: 400px;
}`;

const FormH1 = styled.h1`{
  color: white;
}`;

const LabelWrapper = styled.div`{
  display: flex;
  flex-direction: column;
  margin: 5px;
  gap: 5px;
}`;

const InputWrapper = styled.div`{
  display: flex;
}`;

const FormInput = styled.input`{
  width: 100%;
}`;

function Register() {
  return (
    <FormBox>
      <FormH1>Create an account</FormH1>
      <form action="" method="POST">
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
