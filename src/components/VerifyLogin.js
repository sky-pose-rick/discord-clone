import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import FirebaseAuthUser from '../logic/FirebaseAuthUser';

function VerifyLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!FirebaseAuthUser.isSignedIn()) {
      navigate('/discord-clone/login');
    }
  }, []);

  return (
    <Home />
  );
}

export default VerifyLogin;
