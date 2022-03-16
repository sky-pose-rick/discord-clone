import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

import Login from './Login';
import Register from './Register';

const LoginWrapper = styled.div`{
  background-image: url("/discord-clone/img/nightsky.jpg");
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
  background-size: max(100vw, 150vh);
  background-repeat: no-repeat;
  align-items: center;
  justify-items: center;
}`;

const Credit = styled.div`{
  color: white;
  margin-bottom: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}`;

function LoginRegister(props) {
  const { register } = props;

  return (
    <LoginWrapper>
      {!register && <Login />}
      {register && <Register />}
      <Credit className="credit-text">
        {'Photo by '}
        <a href="https://unsplash.com/@grakozy">Greg Rakozy</a>
        {' on '}
        <a href="http://unsplash.com">Unsplash</a>
      </Credit>
    </LoginWrapper>
  );
}

LoginRegister.propTypes = {
  register: propTypes.bool,
};

LoginRegister.defaultProps = {
  register: true,
};

export default LoginRegister;
