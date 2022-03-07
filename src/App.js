import React from 'react';
import LoginRegister from './components/Frontpage';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      {false && <LoginRegister />}
      <Home />
    </div>
  );
}

export default App;
