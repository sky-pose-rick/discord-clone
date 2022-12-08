import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
import propTypes from 'prop-types';
import FirestoreUser from '../logic/FirestoreUser';

function UserListItem(props) {
  const { userKey } = props;
  const [userDetails, setUserDetails] = useState({
    uid: 0,
    name: 'Loading',
    icon: 'blank.png',
  });

  useEffect(() => {
    FirestoreUser.getUserDetails(userKey, setUserDetails);
  }, [userKey]);

  return (
    <div>
      <img src={userDetails.iconURL} alt="U" />
      <span>{userDetails.name}</span>
    </div>
  );
}

UserListItem.propTypes = {
  userKey: propTypes.string,
};

UserListItem.defaultProps = {
  userKey: null,
};

export default UserListItem;
