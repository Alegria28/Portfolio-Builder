import React from 'react';
import './App.css';
import Portfolio from './components/Portfolio';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Portfolio Builder</h1>
        <p>React frontend connected to Django backend with SQLite</p>
      </header>
      <main style={{ padding: '20px' }}>
        <Portfolio />
      </main>
    </div>
  );
}

export default App;
