import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Fallback() {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: check for login status
  // logged in: redirect to @me
  // logged out: redirect to login
  useEffect(() => {
    console.log('Invalid location', location);
    console.log('Forced re-direct');
    navigate('/discord-clone/server/server1/channel1');
  }, []);

  return (
    <div className="fallback">Re-directing...</div>
  );
}

export default Fallback;
