import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import FirestoreUser from '../logic/FirestoreUser';

const MessageBox = styled.div`{
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  margin: 10px 0px;

  &:hover{
    background-color: gray;
  }

  p{
    margin: 5px 0px;
  }
}`;

const ImageWrapper = styled.div`{
  margin: 10px 20px auto;
  grid-row: 1/3;

  >img{
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: red;
    overflow: clip;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}`;

const MessageHeader = styled.div`{
  margin-top: 5px;
  display: flex;
  align-items: center;

  >span{
    color: #5a5d63;
    font-size: 0.8em;
  }

  >span:first-child{
    color: white;
    font-size: 1em;
    font-weight: bold;
    margin-right: 10px;
  }
}`;

const DeleteButton = styled.button`{
  margin-left: auto;
  margin-right: 10px;
  visibility: hidden;

  ${MessageBox}: hover & {
    visibility: inherit;
  }
}`;

function Message(props) {
  const {
    user, timestamp, content, deleted, isRoot, isModerator, deleteFunc,
  } = props;

  const [userDetails, setUserDetails] = useState({
    uid: 0,
    name: 'Loading',
    icon: 'blank.png',
  });

  if (!isRoot) {
    // useEffect stops re-renders
    useEffect(() => {
      FirestoreUser.getUserDetails(user, setUserDetails);
    }, []);
  }

  const linedContent = content.split('\n');
  const displayDate = new Date();
  displayDate.setTime(timestamp);

  // TODO: remove username and image for consecutive messages
  return (
    <div>
      {isRoot
        && <div>{content}</div>}
      {!isRoot
        && (
        <MessageBox>
          <ImageWrapper>
            <img src={userDetails.icon} alt="U" />
          </ImageWrapper>
          <MessageHeader>
            <span>{userDetails.name}</span>
            <span>{displayDate.toString()}</span>
            {isModerator && !deleted && (
            <DeleteButton type="button" onClick={deleteFunc}>
              X
            </DeleteButton>
            )}
          </MessageHeader>
          <div>
            {deleted && <p>{'<deleted>'}</p>}
            {!deleted
              // eslint-disable-next-line react/no-array-index-key
              && linedContent.map((segment, index) => (<p key={index}>{segment}</p>))}
          </div>
        </MessageBox>
        )}
    </div>
  );
}

Message.propTypes = {
  user: propTypes.string,
  timestamp: propTypes.number,
  content: propTypes.string,
  deleted: propTypes.bool,
  isRoot: propTypes.bool,
  isModerator: propTypes.bool,
  deleteFunc: propTypes.func,
};

Message.defaultProps = {
  user: 'missing',
  timestamp: 0,
  content: 'missing',
  deleted: false,
  isRoot: false,
  isModerator: false,
  deleteFunc: () => {},
};

export default Message;
