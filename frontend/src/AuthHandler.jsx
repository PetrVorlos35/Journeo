import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AuthHandler = ({ token, setToken }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minuty odpočítávání

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const decoded = JSON.parse(atob(token.split('.')[1])); // Dekódování JWT
    const expiryTime = decoded.exp * 1000;
    const warningTime = expiryTime - 60000; // 1 minuta před expirací

    const checkToken = () => {
      const now = Date.now();
      if (now >= expiryTime) {
        logout();
      } else if (now >= warningTime) {
        setShowPopup(true);
      }
    };

    const interval = setInterval(checkToken, 100);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (showPopup) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => logout(), 180000); // Automatické odhlášení po 3 minutách

      return () => clearInterval(countdownInterval);
    }
  }, [showPopup]);

  const refreshToken = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setShowPopup(false);
        setCountdown(180);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Token refresh failed', err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return showPopup ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p>Vaše přihlášení brzy vyprší. Chcete zůstat přihlášeni?</p>
        <p className="text-gray-500">Odhlášení za {countdown} sekund</p>
        <div className="flex justify-center mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={refreshToken}>
            Ano
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>
            Ne
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
AuthHandler.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func.isRequired,
};

export default AuthHandler;
