import React from 'react';
import styled from 'styled-components';

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
  width: 75px;
}`;

const HeaderBar = styled.div`{
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column: 2 / 5;
  color: white;

  div{
    background-color:#363940;
  }

  div:first-child{
    background-color:#303136;
    width: 100px;
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
  width: 100px;
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
  width: 100px;
  grid-row: 2/5;
}`;

function Home() {
  return (
    <ServerFrame>
      <ServerNav>
        <div>SV 1</div>
        <div>SV 2</div>
        <div>SV 3</div>
        <div>SV 4</div>
        <div>SV 5</div>
        <div>SV 6</div>
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
