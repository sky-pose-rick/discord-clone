import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import FirebaseAuthUser from '../logic/FirebaseAuthUser';

function VerifyLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    FirebaseAuthUser.isSignedIn().then((user) => {
      // console.log('verify login', user);
      if (!user) {
        navigate('/discord-clone/login');
      }
    });
  }, []);

  return (
    <Home />
  );
}

export default VerifyLogin;
