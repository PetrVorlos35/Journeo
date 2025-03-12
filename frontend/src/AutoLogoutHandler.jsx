import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const AutoLogoutHandler = () => {
  const [isInactive, setIsInactive] = useState(false);
  const [countdown, setCountdown] = useState(180); // 10 sekund na odhlášení
  const navigate = useNavigate();
  const { t } = useTranslation();
  let inactivityTimer;
  let warningTimer;

  const publicRoutes = ['/trip/', '/login', '/', '/register']; // Seznam veřejných cest


  const resetTimer = () => {
    localStorage.setItem("lastActivity", Date.now());

    if (!localStorage.getItem("token")) return; // Pokud není token, timer se nespustí

    if (!isInactive) { // Resetuj jen pokud už není varování aktivní
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      
      inactivityTimer = setTimeout(() => {
        setIsInactive(true);
        setCountdown(180); // Reset odpočtu na 10 sekund
        startCountdown();
        warningTimer = setTimeout(() => {
          handleLogout();
        }, 180000); // 10 sekund do odhlášení
      }, 300000); // 20 sekund nečinnosti
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
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
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
    };
  }, []);

  const handleLogout = () => {
    const currentPath = window.location.pathname;
    const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

    if (!isPublicRoute) { // Pokud NENÍ na veřejné stránce, odhlásit a přesměrovat
      localStorage.removeItem("token");
      setIsInactive(false);
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
