import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'; // Import your styles
import LandingPage from './LandingPage';
import LoginForm from './LoginForm'; // Import your LoginForm component

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/login" element={<LoginForm />} /> {/* Login Form */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
