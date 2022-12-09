import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import FirestoreUser from '../logic/FirestoreUser';
import modals from '../logic/modals';

const UserListFrame = styled.div`{
  padding: 10px;

  >div {
    font-weight: bold;
    font-size: 1.1em;
    text-align: center;
  }
}`;

const UserRow = styled.li`{
  height: 30px;
  margin: 3px 0px;
  display: flex;
  align-items: center;
  list-style:none;
  background-color: #3a3b40;

  :hover{
    background-color: #3f4145;
  }

  img{
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background-color: red;
    overflow: clip;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 10px;
  }

  >div{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}`;

const UserUL = styled.ul`{
  padding: 0px;
}`;

function useUserList(serverKey) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const onNewUser = async (user) => {
      const userDetails = { ...user };

      await FirestoreUser.getUserDetails(userDetails.uid, (details) => {
        userDetails.name = details.name;
        userDetails.icon = details.icon;
      });

      setUserList((prev) => {
        // check for duplicate listing
        const index = prev.findIndex((oldUser) => user.uid === oldUser.uid);
        if (index > -1) {
          return prev;
        }

        // spread to flag a re-render
        const newArray = [...prev];
        newArray.push(userDetails);
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
    const onChangeUser = async (key, updatedUser) => {
      const userDetails = { ...updatedUser };

      await FirestoreUser.getUserDetails(updatedUser.uid, (details) => {
        userDetails.name = details.name;
        userDetails.icon = details.icon;
      });

      setUserList((prev) => {
        const index = prev.findIndex((user) => key === user.uid);
        if (index > -1) {
          // spread to flag a re-render
          const newArray = [...prev];
          newArray[index] = userDetails;
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
    <UserListFrame>
      <div>Users</div>
      <UserUL>
        {userList.map((user) => (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
          <UserRow
            key={`ul-${user.uid}`}
            onClick={() => {
              if (selfKey === user.uid || user.isOwner) { return; }
              if (selfIsOwner) {
                modals.promoteUserModal(user, serverKey, true);
              } else if (selfIsAdmin && !user.isAdmin) {
                modals.promoteUserModal(user, serverKey, false);
              }
            }}
          >
            <div>
              <img src={user.icon} alt="U" />
              <span>{user.name}</span>
            </div>
          </UserRow>
        ))}
      </UserUL>
    </UserListFrame>
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
