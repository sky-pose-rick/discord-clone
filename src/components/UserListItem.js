import React from 'react';
// import styled from 'styled-components';
import propTypes from 'prop-types';

function UserListItem(props) {
  const { userDetails } = props;

  // TODO: apply styling for owner, admin, moderator
  return (
    <div>
      <img src={userDetails.icon} alt="U" />
      <span>{userDetails.name}</span>
    </div>
  );
}

UserListItem.propTypes = {
  userDetails: propTypes.objectOf(),
};

UserListItem.defaultProps = {
  userDetails: {},
};

export default UserListItem;
