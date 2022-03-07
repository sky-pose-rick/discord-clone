import React from 'react';
import LoginRegister from './components/frontpage';
import Home from './components/home';

function App() {
  return (
    <div className="App">
      {false && <LoginRegister />}
      <Home />
    </div>
  );
}

export default App;
