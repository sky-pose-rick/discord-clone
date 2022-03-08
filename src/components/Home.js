import React from 'react';
import styled from 'styled-components';
import ServerIcon from './ServerIcon';

const channelWidth = '200px';

const ServerFrame = styled.div`{
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-template-rows: auto 1fr auto auto;
  min-height: 100vh;
  min-width: 100vw;
}`;

const ServerNav = styled.div`{
  background-color: #212226;
  color: white;
  grid-row: 1 / 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}`;

const HeaderBar = styled.div`{
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column: 2 / 5;
  color: white;
  height: 30px;
  box-shadow: black 0px 2px 5px 0px;
  z-index: 1;

  div{
    background-color:#363940;
  }

  div:first-child{
    background-color:#303136;
    width: ${channelWidth};
  }
}`;

const ChannelNav = styled.div`{
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  align-items: baseline;
  grid-template-rows: auto;
  align-content: baseline;
  grid-row: 2 / 4;
  background-color: #303136;
  color: white;
  width: ${channelWidth};
}`;

const UserPanel = styled.div`{
  background-color: #2a2b2f;
  color: white;
  grid-row: 4 / 5;
  grid-column: 2 / 3;
  height: 40px;
}`;

const MainContent = styled.div`{
  background-color: #363940;
  color: white;
  grid-row: 2 / 3;
  grid-column: 3 / 4;
  overflow: hidden scroll;
}`;

const InputBox = styled.div`{
  background-color:#363940;
  color: white;
  grid-row: 3/5;
  height: 60px;
  overflow: hidden;
}`;

const UserList = styled.div`{
  background-color: #303136;
  color: white;
  width: ${channelWidth};
  grid-row: 2/5;
}`;

function Home() {
  return (
    <ServerFrame>
      <ServerNav>
        <ServerIcon serverName="Server 1" src="discord-clone/img/profile2.png" />
        <ServerIcon serverName="Server 2" src="gone" alt="OOP" />
        <ServerIcon serverName="Server 7" src="discord-clone/img/profile2.png" />
        <ServerIcon serverName="Server 8" src="gone" alt="OOP" />
      </ServerNav>
      <HeaderBar>
        <div>Header1</div>
        <div>Header2</div>
      </HeaderBar>
      <ChannelNav>
        <div>Channel 1</div>
        <div>Channel 2</div>
        <div>Channel 3</div>
        <div>Channel 4</div>
        <div>Channel 5</div>
        <div>Channel 6</div>
      </ChannelNav>
      <UserPanel>
        User
      </UserPanel>
      <MainContent>
        Main Content
      </MainContent>
      <InputBox>
        Input
      </InputBox>
      <UserList>
        UserList
      </UserList>
    </ServerFrame>
  );
}

export default Home;
