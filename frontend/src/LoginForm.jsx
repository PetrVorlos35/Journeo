import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import googleLogo from "./assets/google.png"; 
import { useTranslation } from 'react-i18next';
import Loading from "./Loading";


function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Zobrazíme Loading před odesláním požadavku
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setSuccess(true);
      setError("");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false); // Po odpovědi skryjeme loading
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
  
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [navigate]);
  
  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 dark:from-black dark:to-gray-900">
      {isLoading && <Loading fullScreen="true" />}
      <Navbar />
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t('loginHead')}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:bg-black dark:border-gray-800 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t('email')}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:bg-black dark:border-gray-800 dark:text-gray-100 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 105.664 66.0645"
                      className="w-5 h-5"
                      fill="currentColor"
                      fillOpacity="0.85"
                    >
                      <path d="M52.832 66.0645C84.2285 66.0645 105.664 40.918 105.664 33.0566C105.664 25.1465 84.2285 0.0488281 52.832 0.0488281C21.9238 0.0488281 0 25.1465 0 33.0566C0 40.918 21.9238 66.0645 52.832 66.0645ZM52.832 59.2285C28.1738 59.2285 7.56836 38.3301 7.56836 33.0566C7.56836 28.8086 28.1738 6.88477 52.832 6.88477C77.4414 6.88477 98.0469 28.8086 98.0469 33.0566C98.0469 38.3301 77.4414 59.2285 52.832 59.2285ZM52.832 54.4434C64.6973 54.4434 74.3164 44.8242 74.3164 32.959C74.3164 21.0938 64.6973 11.4746 52.832 11.4746C40.9668 11.4746 31.3477 21.0938 31.3477 32.959C31.3477 44.8242 40.9668 54.4434 52.832 54.4434ZM52.832 40.2832C48.8281 40.2832 45.5566 37.0117 45.5566 33.0078C45.5566 29.0039 48.8281 25.7324 52.832 25.7324C56.8848 25.7324 60.1074 29.0039 60.1074 33.0078C60.1074 37.0117 56.8848 40.2832 52.832 40.2832Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 105.664 83.5205"
                      className="w-5 h-5"
                      fill="currentColor"
                      fillOpacity="0.85"
                    >
                      <path d="M24.0938 24.946C14.0488 31.461 7.56836 39.4023 7.56836 41.7847C7.56836 47.0581 28.1738 67.9565 52.832 67.9565C57.1768 67.9565 61.3968 67.3051 65.3893 66.178L71.0654 71.8454C65.5138 73.6953 59.3902 74.7925 52.832 74.7925C21.9238 74.7925 0 49.646 0 41.7847C0 37.3141 7.00287 27.3535 18.6796 19.5401ZM105.664 41.7847C105.664 46.0934 99.2246 55.5948 88.2033 63.2909L82.9263 58.018C92.1767 51.8654 98.0469 44.5994 98.0469 41.7847C98.0469 37.5366 77.4414 15.6128 52.832 15.6128C49.0753 15.6128 45.4127 16.1217 41.9217 17.0449L36.1344 11.2621C41.3027 9.70069 46.902 8.77686 52.832 8.77686C84.2285 8.77686 105.664 33.8745 105.664 41.7847ZM60.8232 61.6189C58.3581 62.6254 55.6588 63.1714 52.832 63.1714C40.9668 63.1714 31.3477 53.5522 31.3477 41.687C31.3477 38.872 31.8891 36.1835 32.8886 33.7273ZM74.3164 41.687C74.3164 44.0146 73.9462 46.2557 73.2503 48.3494L46.1544 21.2743C48.2523 20.5746 50.4987 20.2026 52.832 20.2026C64.6973 20.2026 74.3164 29.8218 74.3164 41.687Z" />
                      <path d="M82.2266 74.8901C83.5449 76.2085 85.5957 76.3062 86.9629 74.8901C88.3789 73.4253 88.2812 71.4722 86.9629 70.1538L23.4863 6.72607C22.168 5.40771 20.0195 5.40771 18.7012 6.72607C17.4316 7.99561 17.4316 10.1929 18.7012 11.4624Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('login')}
              </button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">Login successful! Redirecting...</p>}

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-200">
                {t('noAccount')}{" "}
                <a href="/register" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  {t('noAccountLink')}
                </a>
              </p>
            </div>

            <div className="relative flex items-center justify-center">
              <span className="absolute px-2 text-gray-500 dark:text-gray-200">{t('continueW')}</span>
              <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-4"></div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-950 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img className="h-5 w-5 mr-2" src={googleLogo} alt="Google logo" />
                Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
