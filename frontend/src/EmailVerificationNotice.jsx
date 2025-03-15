import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function EmailVerificationNotice() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Po 5 sekundách přesměrovat na login
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-6 relative">
      
      
      {/* Jemné dekorativní čáry */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1 border-t border-gray-300 dark:border-gray-700 opacity-50"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1 border-b border-gray-300 dark:border-gray-700 opacity-50"></div>

      {/* Obsah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-2xl"
      >
        {/* Nadpis */}
        <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          {t("successTitle")}
        </h2>

        {/* Oddělený blok s hlavním textem */}
        <div className="mt-6">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {t("instructions")}
          </p>
        </div>

        {/* Jemné oddělení pro dodatečnou zprávu */}
        <div className="mt-4 border-t border-gray-300 dark:border-gray-700 w-2/3 mx-auto opacity-50"></div>

        {/* Další text - menší a decentní */}
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {t("redirectMessage")}
        </p>

        {/* Minimalistické tlačítko */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/login")}
          className="mt-8 px-6 py-3 bg-gray-900 text-white font-medium rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-600 transition-all"
        >
          {t("loginButton")}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default EmailVerificationNotice;
