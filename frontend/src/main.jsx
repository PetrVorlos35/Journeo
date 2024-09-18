import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'; // Import your styles
import LandingPage from './LandingPage';
import LoginForm from './RegisterForm'; // Import your LoginForm component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/register" element={<LoginForm />} /> {/* Login Form */}
      </Routes>
    </Router>
  </React.StrictMode>
);
