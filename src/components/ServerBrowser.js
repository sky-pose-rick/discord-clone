import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FirestoreUser from '../logic/FirestoreUser';

const ServerList = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row wrap;
`;

const ServerPanel = styled.li`
  flex: 0 1 300px;
  background-color: #5e5e5e;
  margin: 5px;
  box-shadow: #262626 2px 2px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 5px;

  &:hover{
    background-color: #4f4e4e;
  }

  &>img{
    border-radius: 50%;
    overflow: clip;
    background-color: blue;
    width: 50px;
    height: 50px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function useServers() {
  const [serverList, setServerList] = useState([]);

  useEffect(() => {
    // could use snapshots for continuous updates
    // just fetch the servers on initial render
    // will also show already joined servers
    FirestoreUser.getAllServers().then((servers) => {
      setServerList(servers);
    });

    return () => {};
  }, []);

  return serverList;
}

function ServerBrowser(props) {
  const { userKey } = props;
  const serverList = useServers();
  const navigate = useNavigate();
  return (
    <div>
      <ServerList>
        {serverList.map((server) => (
          <ServerPanel
            key={server.serverKey}
            onClick={() => {
              FirestoreUser.addUserToServer(server.serverKey, userKey).then(() => {
                navigate(`/server/${server.serverKey}`);
              });
            }}
          >
            <img src={server.iconURL} alt={server.altText} />
            <span>{server.serverName}</span>
          </ServerPanel>
        ))}
      </ServerList>
    </div>
  );
}

ServerBrowser.propTypes = {
  userKey: propTypes.string,
};

ServerBrowser.defaultProps = {
  userKey: 'missing',
};

export default ServerBrowser;
