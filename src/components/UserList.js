import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
import propTypes from 'prop-types';
import FirestoreUser from '../logic/FirestoreUser';
import UserListItem from './UserListItem';

function useUserList(serverKey) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const onNewUser = (user) => {
      setUserList((prev) => {
        // spread to flag a re-render
        const newArray = [...prev];
        newArray.push(user);
        return newArray;
      });
    };

    const onDeleteUser = (key) => {
      setUserList((prev) => {
        const index = prev.findIndex((user) => key === user.uid);
        if (index > -1) {
          const newArray = prev.slice(0, index).concat(prev.slice(index));
          return newArray;
        }
        // if message is not found, make no changes
        return prev;
      });
    };
    const onChangeUser = (key, updatedUser) => {
      setUserList((prev) => {
        const index = prev.findIndex((user) => key === user.uid);
        if (index > -1) {
          // spread to flag a re-render
          const newArray = [...prev];
          newArray[index] = updatedUser;
          return newArray;
        }
        // if message is not found, make no changes
        return prev;
      });
    };

    FirestoreUser.subscribeToUserList(
      serverKey,
      onNewUser,
      onChangeUser,
      onDeleteUser,
    );

    return () => {
      FirestoreUser.unSubscribeToUserList();
    };
  }, []);

  return userList;
}

function UserList(props) {
  const {
    serverKey, selfKey,
  } = props;
  const userList = useUserList(serverKey);

  let selfIsOwner = false;
  let selfIsAdmin = false;
  const selfIndex = userList.findIndex((user) => user.uid === selfKey);
  if (selfIndex > -1) {
    selfIsOwner = userList[selfIndex].isOwner;
    selfIsAdmin = userList[selfIndex].isAdmin;
  }
  return (
    <div>
      <div>Users</div>
      <ul>
        {userList.map((user) => (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
          <li key={`ul-${user.uid}`}>
            <UserListItem
              userKey={user.uid}
              isOwner={user.isOwner}
              isAdmin={user.isAdmin}
              isModerator={user.isModerator}
              onClick={() => {
                if (selfKey === user.uid || user.isOwner) { return; }
                if (selfIsOwner) {
                  // modal with options for user, admin, moderator
                } else if (selfIsAdmin && !user.isAdmin) {
                  // modal with options for user, moderator
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

UserList.propTypes = {
  serverKey: propTypes.string,
  selfKey: propTypes.string,
};

UserList.defaultProps = {
  serverKey: null,
  selfKey: null,
};

export default UserList;
