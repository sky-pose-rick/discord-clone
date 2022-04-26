import React from 'react';
import {
  BrowserRouter,
  Route, Routes,
} from 'react-router-dom';
import Fallback from './components/Fallback';
import LoginRegister from './components/Frontpage';
import VerifyLogin from './components/VerifyLogin';
import modalService from './logic/modalService';

function App() {
  const modalWindow = modalService.getModalWindow();

  return (
    <BrowserRouter>
      {modalWindow}
      <Routes>
        {/* <Route path="/discord-clone" element={<Home />} /> */}
        <Route path="/discord-clone/register" element={<LoginRegister register />} />
        <Route path="/discord-clone/login" element={<LoginRegister register={false} />} />
        <Route path="/discord-clone/@me/:chatKey" element={<VerifyLogin />} />
        <Route path="/discord-clone/@me" element={<VerifyLogin />} />
        <Route path="/discord-clone/server/:serverKey/:channelKey" element={<VerifyLogin />} />
        <Route path="/discord-clone/server/:serverKey" element={<VerifyLogin />} />
        <Route path="/discord-clone/server" element={<VerifyLogin />} />
        <Route path="/discord-clone/discovery" element={<VerifyLogin />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
