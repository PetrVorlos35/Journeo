import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'; 
import LandingPage from './LandingPage';
import RegisterForm from './RegisterForm'; 
import LoginForm from './LoginForm'; 
import Dashboard from './Dashboard';
import CreateTrip from './CreateTrip';
import EditTrip from './EditTrip';
import TestRegister from './RegisterTest'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; 
import PublicTrip from './PublicTrip';
import AutoLogoutHandler from './AutoLogoutHandler';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
    <Router>
      <AutoLogoutHandler />
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/register" element={<RegisterForm />} /> {/* Regidster Form */}
        <Route path="/login" element={<LoginForm />} /> {/* Login Form */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Account Overview */}
        <Route path="/create-trip" element={<CreateTrip />} /> {/* Create Trip */}
        <Route path="/edit-trip" element={<EditTrip />} /> {/* Create Trip */}
        <Route path="/test" element={<TestRegister />} /> {/* Test Register */}
        <Route path="/trip/:tripId" element={<PublicTrip />} />

      </Routes>
    </Router>
    </I18nextProvider>
  </React.StrictMode>
);
