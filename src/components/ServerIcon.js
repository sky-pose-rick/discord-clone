import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const ItemWrapper = styled.div`{
  position: relative;
  padding-right: 10px;
  padding-left: 10px;

  &:hover{
    border-left: white 2px solid;
    padding-left: 8px;

    div{
      border-radius: 15px;
    }
  }
}`;

const ActiveItemWrapper = styled(ItemWrapper)`{
  ${(props) => {
    if (props.serveractive) {
      return `&&{
        padding-left: 8px;
        border-left: white 2px solid;

        div{
          border-radius: 15px;
        }
      }`;
    }
    return '';
  }}
}`;

const IconWrapper = styled.div`{
  border-radius: 50%;
  overflow: hidden;

  &:hover::after{
    position: absolute;
    top: 10px;
    background-color: #191a1e;
    left: 65px;
    width: max-content;
    padding: 5px;
    content:"${(props) => props.serverName}";
    z-index: 2;
  }
}`;

const ServerIconImage = styled.img`{

  ${(props) => {
    if (props.isDefault) {
      return `{
        &&{background-color: #687759}
      }`;
    }
    return `{
      &&{background-color: blue}
    }`;
  }}

  width: 50px;
  height: 50px;
  background-color: blue;
  /* flex the alt text to the center of the icon */
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
}`;

function ServerIcon(props) {
  const {
    src, alt, serverActive, serverName, isDefault,
  } = props;

  return (
    <ActiveItemWrapper serveractive={serverActive}>
      <IconWrapper serverName={serverName}>
        <ServerIconImage src={src} alt={alt} isDefault={isDefault} />
      </IconWrapper>
    </ActiveItemWrapper>
  );
}

ServerIcon.propTypes = {
  src: propTypes.string,
  alt: propTypes.string,
  serverName: propTypes.string,
  serverActive: propTypes.bool,
  isDefault: propTypes.bool,
};

ServerIcon.defaultProps = {
  src: '',
  alt: 'ERR',
  serverName: '',
  serverActive: false,
  isDefault: false,
};

export default ServerIcon;
