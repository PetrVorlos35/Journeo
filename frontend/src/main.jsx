import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'; // Import your styles
import LandingPage from './LandingPage';
import RegisterForm from './RegisterForm'; 
import LoginForm from './LoginForm'; 
import Dashboard from './Dashboard';
import CreateTrip from './CreateTrip';
import TestRegister from './RegisterTest'
import OverviewTrip from './OverviewTrip';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/register" element={<RegisterForm />} /> {/* Regidster Form */}
        <Route path="/login" element={<LoginForm />} /> {/* Login Form */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Account Overview */}
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/test" element={<TestRegister />} />
        <Route path="/trip/overview/:tripId" element={<OverviewTrip />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
