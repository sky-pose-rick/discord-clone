import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Fallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Invalid location', location);
    console.log('Forced re-direct');
    navigate('/server/@me');
  }, []);

  return (
    <div className="fallback">Re-directing...</div>
  );
}

export default Fallback;
