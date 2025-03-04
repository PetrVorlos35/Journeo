import { useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
import confetti from "canvas-confetti";


function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleConfettiClick = () => {
    confetti({
      particleCount: 200,
      spread: 360,
      origin: { y: 0.6 },
    });
  };
  

  const handleLoginClick = () => {
    handleConfettiClick();
    navigate(isAuthenticated ? "/dashboard" : "/login");
  };

  return (
    <div className="bg-gray-50 dark:bg-black">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-blue-200 to-blue-50 dark:from-black dark:to-gray-800 text-white py-40 flex flex-col items-center text-center px-4">
        <h1 className="text-6xl font-extrabold drop-shadow-xl text-blue-500 dark:text-white">
          {t("welcome")}
        </h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto text-blue-500 dark:text-gray-300">
          {t("description")}
        </p>
        <button 
          onClick={handleLoginClick} 
          className="mt-6 bg-blue-500 dark:bg-gray-900 text-gray-100 font-bold py-3 px-10 rounded-full shadow-lg text-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          {isAuthenticated ? t("gotoDash") : t("login")}
        </button>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 text-center bg-gradient-to-t dark:bg-gradient-to-b from-gray-100 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            {t("planAdventure")}
          </h2>
          <p className="text-lg max-w-3xl mx-auto mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
            {t("planAdventureDes")}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-100 via-gray-50 to-blue-50 dark:from-gray-900 dark:to-black">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-12 text-gray-800 dark:text-white">
            {t("features")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature Card 1 */}
            <div className="p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 76.5625 71.2402"
                className="w-12 h-12 m-5 inline-block mr-2 fill-current dark:text-white"
              >
                <g>
                  <rect height="71.2402" opacity="0" width="76.5625" x="0" y="0" />
                  <path
                    d="M12.4512 71.2402L64.1113 71.2402C72.4609 71.2402 76.5625 67.1387 76.5625 58.9355L76.5625 12.3535C76.5625 4.15039 72.4609 0.0488281 64.1113 0.0488281L12.4512 0.0488281C4.15039 0.0488281 0 4.15039 0 12.3535L0 58.9355C0 67.1387 4.15039 71.2402 12.4512 71.2402ZM11.7676 64.1602C8.74023 64.1602 7.03125 62.5488 7.03125 59.375L7.03125 22.6562C7.03125 19.4824 8.74023 17.8711 11.7676 17.8711L64.7461 17.8711C67.7734 17.8711 69.5312 19.4824 69.5312 22.6562L69.5312 59.375C69.5312 62.5488 67.7734 64.1602 64.7461 64.1602ZM30.8594 31.6895L33.1055 31.6895C34.5703 31.6895 35.0586 31.2012 35.0586 29.7852L35.0586 27.5391C35.0586 26.123 34.5703 25.6348 33.1055 25.6348L30.8594 25.6348C29.4434 25.6348 28.9551 26.123 28.9551 27.5391L28.9551 29.7852C28.9551 31.2012 29.4434 31.6895 30.8594 31.6895ZM43.457 31.6895L45.7031 31.6895C47.1191 31.6895 47.6074 31.2012 47.6074 29.7852L47.6074 27.5391C47.6074 26.123 47.1191 25.6348 45.7031 25.6348L43.457 25.6348C41.9922 25.6348 41.5039 26.123 41.5039 27.5391L41.5039 29.7852C41.5039 31.2012 41.9922 31.6895 43.457 31.6895ZM56.0059 31.6895L58.252 31.6895C59.668 31.6895 60.2051 31.2012 60.2051 29.7852L60.2051 27.5391C60.2051 26.123 59.668 25.6348 58.252 25.6348L56.0059 25.6348C54.541 25.6348 54.0527 26.123 54.0527 27.5391L54.0527 29.7852C54.0527 31.2012 54.541 31.6895 56.0059 31.6895ZM18.3105 44.043L20.5566 44.043C22.0215 44.043 22.5098 43.5547 22.5098 42.1387L22.5098 39.8926C22.5098 38.4766 22.0215 37.9883 20.5566 37.9883L18.3105 37.9883C16.8945 37.9883 16.3574 38.4766 16.3574 39.8926L16.3574 42.1387C16.3574 43.5547 16.8945 44.043 18.3105 44.043ZM30.8594 44.043L33.1055 44.043C34.5703 44.043 35.0586 43.5547 35.0586 42.1387L35.0586 39.8926C35.0586 38.4766 34.5703 37.9883 33.1055 37.9883L30.8594 37.9883C29.4434 37.9883 28.9551 38.4766 28.9551 39.8926L28.9551 42.1387C28.9551 43.5547 29.4434 44.043 30.8594 44.043ZM43.457 44.043L45.7031 44.043C47.1191 44.043 47.6074 43.5547 47.6074 42.1387L47.6074 39.8926C47.6074 38.4766 47.1191 37.9883 45.7031 37.9883L43.457 37.9883C41.9922 37.9883 41.5039 38.4766 41.5039 39.8926L41.5039 42.1387C41.5039 43.5547 41.9922 44.043 43.457 44.043ZM56.0059 44.043L58.252 44.043C59.668 44.043 60.2051 43.5547 60.2051 42.1387L60.2051 39.8926C60.2051 38.4766 59.668 37.9883 58.252 37.9883L56.0059 37.9883C54.541 37.9883 54.0527 38.4766 54.0527 39.8926L54.0527 42.1387C54.0527 43.5547 54.541 44.043 56.0059 44.043ZM18.3105 56.3965L20.5566 56.3965C22.0215 56.3965 22.5098 55.9082 22.5098 54.4922L22.5098 52.2461C22.5098 50.8301 22.0215 50.3418 20.5566 50.3418L18.3105 50.3418C16.8945 50.3418 16.3574 50.8301 16.3574 52.2461L16.3574 54.4922C16.3574 55.9082 16.8945 56.3965 18.3105 56.3965ZM30.8594 56.3965L33.1055 56.3965C34.5703 56.3965 35.0586 55.9082 35.0586 54.4922L35.0586 52.2461C35.0586 50.8301 34.5703 50.3418 33.1055 50.3418L30.8594 50.3418C29.4434 50.3418 28.9551 50.8301 28.9551 52.2461L28.9551 54.4922C28.9551 55.9082 29.4434 56.3965 30.8594 56.3965ZM43.457 56.3965L45.7031 56.3965C47.1191 56.3965 47.6074 55.9082 47.6074 54.4922L47.6074 52.2461C47.6074 50.8301 47.1191 50.3418 45.7031 50.3418L43.457 50.3418C41.9922 50.3418 41.5039 50.8301 41.5039 52.2461L41.5039 54.4922C41.5039 55.9082 41.9922 56.3965 43.457 56.3965Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                </g>
              </svg>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">
                {t("itineraryPlan")}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {t("itineraryPlanDes")}
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 90.5273 66.2598"
                className="w-12 h-12 m-5 inline-block mr-2 fill-current dark:text-white"
              >
                <g>
                  <rect height="66.2598" opacity="0" width="90.5273" x="0" y="0" />
                  <path
                    d="M17.7246 52.2949L27.0996 52.2949C29.3457 52.2949 30.8594 50.7812 30.8594 48.6328L30.8594 41.5527C30.8594 39.4043 29.3457 37.8906 27.0996 37.8906L17.7246 37.8906C15.4785 37.8906 13.9648 39.4043 13.9648 41.5527L13.9648 48.6328C13.9648 50.7812 15.4785 52.2949 17.7246 52.2949ZM3.51562 24.7559L87.0605 24.7559L87.0605 15.9668L3.51562 15.9668ZM12.4512 66.2598L78.0762 66.2598C86.4258 66.2598 90.5273 62.207 90.5273 54.0039L90.5273 12.3047C90.5273 4.10156 86.4258 0.0488281 78.0762 0.0488281L12.4512 0.0488281C4.15039 0.0488281 0 4.10156 0 12.3047L0 54.0039C0 62.207 4.15039 66.2598 12.4512 66.2598ZM12.5488 59.2285C9.0332 59.2285 7.03125 57.3242 7.03125 53.6133L7.03125 12.6953C7.03125 8.98438 9.0332 7.08008 12.5488 7.08008L77.9785 7.08008C81.4941 7.08008 83.4961 8.98438 83.4961 12.6953L83.4961 53.6133C83.4961 57.3242 81.4941 59.2285 77.9785 59.2285Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                </g>
              </svg>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">
                {t("expenseTrack")}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {t("expenseTrackDes")}
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 81.1523 76.3184"
                className="w-12 h-12 m-5 inline-block mr-2 fill-current dark:text-white"
              >
                <g>
                  <rect height="76.3184" opacity="0" width="81.1523" x="0" y="0" />
                  <path
                    d="M4.73633 74.8535C5.81055 74.8535 6.83594 74.5117 8.20312 73.7793L27.5391 63.4277L48.877 75.1465C50.3418 75.9277 51.9043 76.3184 53.418 76.3184C54.834 76.3184 56.25 75.9766 57.373 75.3418L77.5391 64.0137C79.9805 62.6465 81.1523 60.5469 81.1523 57.8125L81.1523 6.29883C81.1523 3.22266 79.4434 1.51367 76.3672 1.51367C75.3418 1.51367 74.2676 1.85547 72.9004 2.58789L52.5879 13.9648L31.5918 1.07422C30.4688 0.390625 29.1016 0.0488281 27.7344 0.0488281C26.3184 0.0488281 24.9023 0.390625 23.7305 1.07422L3.61328 12.4023C1.12305 13.7695 0 15.8691 0 18.5547L0 70.0684C0 73.1445 1.70898 74.8535 4.73633 74.8535ZM24.707 56.4453L8.05664 65.5273C7.86133 65.625 7.66602 65.7227 7.51953 65.7227C7.17773 65.7227 7.03125 65.5273 7.03125 65.1855L7.03125 20.3613C7.03125 19.4336 7.42188 18.75 8.30078 18.2129L23.3398 9.57031C23.8281 9.27734 24.2676 9.0332 24.707 8.74023ZM31.7871 57.1777L31.7871 9.7168C32.1777 9.96094 32.6172 10.2051 33.0078 10.4492L49.3652 20.4102L49.3652 66.8457C48.7793 66.5039 48.1934 66.2109 47.6074 65.8691ZM56.3965 67.6758L56.3965 19.9707L73.0957 10.8398C73.291 10.7422 73.4863 10.6445 73.6328 10.6445C73.9258 10.6445 74.0723 10.8398 74.0723 11.1816L74.0723 56.0547C74.0723 56.9824 73.7305 57.666 72.8516 58.2031L58.252 66.6016C57.666 66.9922 57.0312 67.334 56.3965 67.6758Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                </g>
              </svg>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">
                {t("map")}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {t("mapDes")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-t from-blue-100 to-blue-50 dark:bg-gradient-to-b dark:from-black dark:to-gray-800 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-500 dark:text-white">
            {t("startAdventure")}
          </h2>
          <p className="text-lg max-w-2xl mx-auto mt-4 text-blue-500 dark:text-gray-300">
            {t("ctaDes")}
          </p>

          <div className="flex flex-col items-center gap-2">
          <button 
            onClick={handleLoginClick} 
            className="mt-6 bg-blue-500 dark:bg-gray-900 text-gray-100 font-bold py-3 px-10 rounded-full shadow-lg text-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {isAuthenticated ? t("gotoDash") : t("login")}
          </button>

          <button 
            onClick={handleConfettiClick} 
            className="mt-4 bg-pink-500 dark:bg-pink-700 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg hover:bg-pink-600 dark:hover:bg-pink-800 transition duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            🎉 {t("confetti")} 🎉
          </button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
