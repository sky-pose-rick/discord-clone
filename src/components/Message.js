import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const MessageBox = styled.div`{
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  margin: 10px 0px;

  p:hover{
    background-color: gray;
  }

  p{
    margin: 5px 0px;
  }
}`;

const ImageWrapper = styled.div`{
  border-radius: 50%;
  overflow: clip;
  background-color: red;
  width: 50px;
  height: 50px;
  grid-row: 1/3;
  margin: 0px 20px;
}`;

const MessageHeader = styled.div`{
  margin-top: 5px;

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

function Message(props) {
  const { user, timestamp, content } = props;

  return (
    <MessageBox>
      <ImageWrapper>
        <div />
      </ImageWrapper>
      <MessageHeader>
        <span>{user}</span>
        <span>{timestamp}</span>
      </MessageHeader>
      <div>
        {content.map((entry) => (
          <p>{entry}</p>
        ))}
      </div>
    </MessageBox>
  );
}

Message.propTypes = {
  user: propTypes.string.isRequired,
  timestamp: propTypes.string.isRequired,
  content: propTypes.arrayOf(propTypes.string),
};

Message.defaultProps = {
  content: ['missing'],
};

export default Message;
