import React from 'react';
import {
  BrowserRouter,
  HashRouter, Route, Routes,
} from 'react-router-dom';
import LoginRegister from './components/Frontpage';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/discord-clone" element={<Home />} /> */}
        <Route path="/discord-clone/register" element={<LoginRegister register />} />
        <Route path="/discord-clone/login" element={<LoginRegister register={false} />} />
        <Route path="/discord-clone/@me/:chatKey" element={<Home />} />
        <Route path="/discord-clone/server/:serverKey/:channelKey" element={<Home />} />
        <Route path="/discord-clone/discovery" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
