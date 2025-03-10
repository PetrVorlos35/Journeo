import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogoutHandler = () => {
  const [isInactive, setIsInactive] = useState(false);
  const [countdown, setCountdown] = useState(180); // 10 sekund na odhlášení
  const navigate = useNavigate();
  let inactivityTimer;
  let warningTimer;

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
    localStorage.removeItem("token");
    setIsInactive(false); // Zavři modal
    navigate("/login");
  };

  const stayLoggedIn = () => {
    setIsInactive(false);
    resetTimer(); // Restartuj časovač po potvrzení aktivity
  };

  return (
    isInactive && localStorage.getItem("token") && (
<div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg text-center w-96">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Jste neaktivní! Chcete pokračovat?
          </h2>
          <p className="text-xl font-bold text-red-500 my-3">
            Odhlášení za {countdown} s
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={stayLoggedIn}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition-all"
            >
              Ano, pokračovat
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-all"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AutoLogoutHandler;
