import styled from 'styled-components';

const channelWidth = '200px';

const ServerFrame = styled.div`{
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-template-rows: auto 1fr auto auto;
  min-height: 100vh;
  min-width: 100vw;
  max-height: max(100vh, 200px);
}`;

const ServerNav = styled.nav`{
  background-color: #212226;
  color: white;
  grid-row: 1 / 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0px;
  overflow: hidden scroll;
  scrollbar-width: none;

  .line{
    border-bottom: solid 1px gray;
    width: 50%;
  }
}`;

const HeaderBar = styled.div`{
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column: 2 / 5;
  color: white;
  height: 3em;
  box-shadow: black 0px 2px 5px 0px;
  z-index: 1;

  &>div{
    background-color:#363940;
    display: flex;
    align-items: center;
    font-weight: bold;
    padding-left: 10px;
    gap: 20px;
  }

  &>div:first-child {
    background-color: #303136;
    width: ${channelWidth};
    box-sizing: border-box;
  }

  .symbolled{
    display: flex;
    align-items: center;
  }

  .symbolled::before {
    content: "#";
    color: #6f747a;
    margin: 0px 10px;
    font-size: 2em; 
    font-weight: 100;
  }

  .channel-desc{
    font-size: 0.8em;
    font-weight: normal;
    color: #b4aab5;
  }

  .line{
    border-left: solid 1px gray;
    height: 50%;
  }

  .signout{
    margin-left: auto;
    margin-right: 1em;
  }
}`;

const ChannelNav = styled.nav`{
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
  padding: 20px 5px;
  box-sizing: border-box;
  row-gap: 5px;
  overflow: hidden scroll;
  scrollbar-width: none;
}`;

const Channel = styled.div`{
  padding: 5px 5px;
  border-radius: 5px;

  &:hover{
    background-color: #393c43;

    .symbolled{
      color: #dee1d8;
    }

    .symbolled::after{
      content: "G";
      margin-left: auto;
    }
  }

  .symbolled{
    display: flex;
    align-items: center;
    color: #85888f;
  }

  .symbolled::before {
    content: "#";
    color: #6f747a;
    padding: 0px 5px;
    font-size: 1.2em;
    font-weight: 100;
  }
}`;

const UserPanel = styled.div`{
  background-color: #2a2b2f;
  color: white;
  grid-row: 4 / 5;
  grid-column: 2 / 3;
  height: 40px;
}`;

const MainContent = styled.main`{
  background-color: #363940;
  color: white;
  grid-row: 2 / 3;
  grid-column: 3 / 4;
  overflow: hidden scroll;
  padding-top:10px;
  scrollbar-width: thin;
  scrollbar-color: #313235 #42454a;
}`;

const InputBox = styled.div`{
  background-color:#363940;
  color: white;
  grid-row: 3/5;
  height: 75px;
  overflow: hidden;
  display: flex;
  align-items: baseline;

  textarea{
    width: 100%;
    margin: 0px 20px;
    height: 1em;
    padding: 1em 10px;
    background-color: #40454b;
    color: white;
    border: none;
    border-radius: 5px;
    outline: none;
    resize: none;
    font-family: inherit;
  }
}`;

const UserList = styled.div`{
  background-color: #303136;
  color: white;
  width: ${channelWidth};
  grid-row: 2/5;
}`;

export default {
  ServerFrame,
  ServerNav,
  HeaderBar,
  ChannelNav,
  Channel,
  UserPanel,
  MainContent,
  InputBox,
  UserList,
};
