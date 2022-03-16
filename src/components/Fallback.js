import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Fallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/discord-clone/server/server1/channel1');
  }, []);

  // TODO: remove username and image for consecutive messages
  return (
    <div className="fallback">Re-directing...</div>
  );
}

export default Fallback;
