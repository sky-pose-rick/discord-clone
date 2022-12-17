/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStyles from '../component-styles/RegisterStyles';
import FirebaseAuthUser from '../logic/FirebaseAuthUser';
import FirestoreUser from '../logic/FirestoreUser';

const {
  FormBox,
  FormH1,
  LabelWrapper,
  InputWrapper,
  FormInput,
} = RegisterStyles;

function Register() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    // console.table(e.target);

    const email = form[0].value;
    const username = form[1].value;
    const password = form[2].value;
    const month = form[3].value;
    const day = form[4].value;
    const year = form[5].value;

    const userDetails = {
      email,
      username,
      password,
      birthday: `${month}-${day}-${year}`,
    };

    // create user in auth
    FirebaseAuthUser.registerUser(userDetails, async (newUser) => {
      // create user in firestore
      await FirestoreUser.createNewUser(newUser.uid, newUser.displayName);
      // TODO: navigate to neutral location
      navigate('/server/@me');
    });
  };

  return (
    <FormBox>
      <FormH1>Create an account</FormH1>
      <form action="" onSubmit={onSubmit}>
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
            <FormInput name="register-month" type="text" placeholder="Month #" required />
            <FormInput name="register-day" type="text" placeholder="Day #" required />
            <FormInput name="register-year" type="text" placeholder="Year" required />
          </InputWrapper>
        </LabelWrapper>
        <button type="submit">Continue</button>
      </form>
      <div>
        <a href="/login">Already have an account?</a>
      </div>
      <div className="policy">
        By registering, you agree to not make a mess of this project.
      </div>
    </FormBox>
  );
}

export default Register;
