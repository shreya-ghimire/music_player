// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';

ReactDOM.render(
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>,
  document.getElementById('root')
);
