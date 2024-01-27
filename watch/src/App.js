import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthComponent from './components/AuthComponent.js';
import Main from './components/Main.js';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<AuthComponent />} />
      <Route path="/watchlist" element={<Main />} />
    </Routes>
  </Router>
  );
};

export default App;
