import React from 'react';
import {
  MemoryRouter,
  Route, Routes,
} from 'react-router-dom';
import Fallback from './components/Fallback';
import LoginRegister from './components/Frontpage';
import Home from './components/Home';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        {/* <Route path="/discord-clone" element={<Home />} /> */}
        <Route path="/discord-clone/register" element={<LoginRegister register />} />
        <Route path="/discord-clone/login" element={<LoginRegister register={false} />} />
        <Route path="/discord-clone/@me/:chatKey" element={<Home />} />
        <Route path="/discord-clone/@me" element={<Home />} />
        <Route path="/discord-clone/server/:serverKey/:channelKey" element={<Home />} />
        <Route path="/discord-clone/server/:serverKey" element={<Home />} />
        <Route path="/discord-clone/server" element={<Home />} />
        <Route path="/discord-clone/discovery" element={<Home />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </MemoryRouter>
  );
}

export default App;
