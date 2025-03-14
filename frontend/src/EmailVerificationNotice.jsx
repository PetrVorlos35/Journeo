import { useEffect } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 dark:from-black dark:to-gray-900">
      <div className="max-w-lg p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ✅ {t("successTitle")}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          {t("instructions")}
        </p>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
          {t("redirectMessage")}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          {t("loginButton")}
        </button>
      </div>
    </div>
  );
}

export default EmailVerificationNotice;
