import { FaFacebook, FaTwitter, FaInstagram, FaSpotify, FaLinkedin } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import logo from './assets/Journeo_white.png';

function Footer() {
    const { t } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);


  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
          <div className="mb-4 flex justify-center md:justify-start">
            <img src={logo} alt="Journeo Logo" className="h-12" />
          </div>
            <h3 className="text-lg font-semibold mb-4">{t('journeoAbout')}</h3>
            <p className="text-sm">
            {t('journeoAboutDes')}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('guickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-white hover:text-gray-200 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gray-200 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">{t('home')}</a></li>
              <li><a href="/#about" className="text-white hover:text-gray-200 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gray-200 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">{t('about')}</a></li>
              <li><a href="/#features" className="text-white hover:text-gray-200 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gray-200 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">{t('features')}</a></li>
              {!isAuthenticated ? (
                <></>
              ) : (
                <>
                    <li><a href="/dashboard" className="text-white hover:text-gray-200 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gray-200 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">Dashboard</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('followUs')}</h3>
            <div className="flex justify-center md:justify-start space-x-4">
            <div className="flex space-x-4">
            {/* Instagram */}
            <a href="https://instagram.com/petr.vorel35" target="_blank" rel="noopener noreferrer" className="group">
                <FaInstagram size={24} className="transition-all duration-300 group-hover:fill-[url(#instagram-gradient)]" />
            </a>

            {/* Facebook */}
            <a href="https://facebook.com/PetrVorlicek06" target="_blank" rel="noopener noreferrer" className="group">
                <FaFacebook size={24} className="transition-all duration-300 group-hover:fill-[url(#facebook-gradient)]" />
            </a>

            {/* Twitter/X */}
            <a href="https://x.com/Vorel35" target="_blank" rel="noopener noreferrer" className="group">
                <FaTwitter size={24} className="transition-all duration-300 group-hover:fill-[url(#twitter-gradient)]" />
            </a>

            {/* Spotify */}
            <a href="https://open.spotify.com/playlist/5TwZJVsfH5I2swTuiZXJx6" target="_blank" rel="noopener noreferrer" className="group">
                <FaSpotify size={24} className="transition-all duration-300 group-hover:fill-[url(#spotify-gradient)]" />
            </a>

             {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/petr-vorlicek/" target="_blank" rel="noopener noreferrer" className="group">
                <FaLinkedin size={24} className="transition-all duration-300 group-hover:fill-[url(#linkedin-gradient)]" />
            </a>

            {/* Gradient Definitions */}
            <svg width="0" height="0">
                {/* Instagram */}
                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#feda75", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#d62976", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#962fbf", stopOpacity: 1 }} />
                </linearGradient>

                {/* Facebook */}
                <linearGradient id="facebook-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1877F2", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#0D47A1", stopOpacity: 1 }} />
                </linearGradient>

                {/* Twitter/X */}
                <linearGradient id="twitter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1DA1F2", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#0A66C2", stopOpacity: 1 }} />
                </linearGradient>

                {/* Spotify */}
                <linearGradient id="spotify-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1DB954", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#1ED760", stopOpacity: 1 }} />
                </linearGradient>

                {/* LinkedIn */}
                <linearGradient id="linkedin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#0A66C2", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#004182", stopOpacity: 1 }} />
                </linearGradient>
            </svg>
            </div>

            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">&copy; Journeo. Petr Vorlíček 2024/25. {t('allRights')}.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
