import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react'; // Import useState
import Navbar from './Navbar';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';


function LandingPage() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const { t } = useTranslation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    else {
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />
      {/* Header Section */}
      <header className="bg-gray-600 text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-lg mb-6">{t('description')}</p>
          <a onClick={handleLoginClick} className="bg-white text-gray-600 cursor-pointer py-3 px-6 rounded-full text-lg hover:bg-gray-200">
            {isAuthenticated ? t('gotoDash') : t('login')}
          </a>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('planAdventure')}</h2>
          <p className="text-lg leading-relaxed">
          {t('planAdventureDes')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className="py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">{t('features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{t('itineraryPlan')}</h3>
              <p>{t('itineraryPlanDes')}</p>
            </div>
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{t('expenseTrack')}</h3>
              <p>{t('expenseTrackDes')}</p>
            </div>
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{t('map')}</h3>
              <p>{t('mapDes')}</p>
            </div>
            {/* <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Flight tracking</h3>
              <p>Track your flights and get real-time updates.</p>
            </div> */}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
