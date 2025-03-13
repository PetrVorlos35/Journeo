import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AutoLogoutHandler = () => {
  const [isInactive, setIsInactive] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minuty na odhlášení
  const navigate = useNavigate();
  const { t } = useTranslation();
  const inactivityTimer = useRef(null);
  const countdownTimer = useRef(null);
  const warningTimer = useRef(null);

  const publicRoutes = ['/trip/', '/login', '/register']; // Seznam veřejných cest

  const resetTimer = () => {
    localStorage.setItem("lastActivity", Date.now());

    if (!localStorage.getItem("token")) return; // Pokud není token, timer se nespustí

    // Resetujeme všechny existující timeouty
    clearTimeout(inactivityTimer.current);
    clearTimeout(warningTimer.current);

    if (!isInactive) { 
      inactivityTimer.current = setTimeout(() => {
        setIsInactive(true);
        setCountdown(180); // 3 minuty do odhlášení
        startCountdown();
        warningTimer.current = setTimeout(handleLogout, 180000); // Automatické odhlášení po 3 minutách
      }, 300000); // 5 minut nečinnosti
    }
  };

  useEffect(() => {
    const lastActivity = localStorage.getItem("lastActivity");
    const currentTime = Date.now();

    if (lastActivity && currentTime - lastActivity > 300000) { // 5 minut
      handleLogout();
    }

    resetTimer(); // Spustíme časovač znovu
  }, []);

  const startCountdown = () => {
    if (countdownTimer.current) clearInterval(countdownTimer.current); // Zastavení předchozího intervalu

    countdownTimer.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer.current);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer(); // Inicializace

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(inactivityTimer.current);
      clearTimeout(warningTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, []);

  const handleLogout = () => {
    const currentPath = window.location.pathname;
    const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

    if (!isPublicRoute) { // Pokud NENÍ na veřejné stránce, odhlásit a přesměrovat
      localStorage.removeItem("token");
      setIsInactive(false);
      clearInterval(countdownTimer.current);
      navigate("/login");
    } else {
      console.log("Veřejná stránka, odhlášení neproběhlo.");
    }
  };

  const stayLoggedIn = () => {
    setIsInactive(false);
    resetTimer(); // Restartuj časovač po potvrzení aktivity
  };

  return (
    isInactive && localStorage.getItem("token") && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg text-center w-96">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('inactive')}
          </h2>
          <p className="text-xl font-bold text-red-500 my-3">
            {t('logoutIn')} {countdown} s
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={stayLoggedIn}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition-all"
            >
              {t('stayLoggedIn')}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-all"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AutoLogoutHandler;
