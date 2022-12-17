import React from 'react';
import {
  HashRouter,
  Route, Routes,
} from 'react-router-dom';
import Fallback from './components/Fallback';
import LoginRegister from './components/Frontpage';
import VerifyLogin from './components/VerifyLogin';
import modalService from './logic/modalService';

function App() {
  const modalWindow = modalService.getModalWindow();

  return (
    <HashRouter>
      {modalWindow}
      <Routes>
        <Route path="/register" element={<LoginRegister register />} />
        <Route path="/login" element={<LoginRegister register={false} />} />
        <Route path="/server/:serverKey/:channelKey" element={<VerifyLogin />} />
        <Route path="/server/:serverKey" element={<VerifyLogin />} />
        <Route path="/server" element={<VerifyLogin />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
