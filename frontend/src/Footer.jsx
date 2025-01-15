import { FaFacebook, FaTwitter, FaInstagram, FaSpotify } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
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
              <li><a href="/dashboard" className="text-white hover:text-gray-200 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gray-200 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">Dashboard</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('followUs')}</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://instagram.com/petr.vorel35" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                <FaInstagram size={24} />
              </a>
              <a href="https://facebook.com/PetrVorlicek06" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                <FaFacebook size={24} />
              </a>
              <a href="https://x.com/Vorel35" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaTwitter size={24} />
              </a>
              <a href="https://open.spotify.com/playlist/5TwZJVsfH5I2swTuiZXJx6" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                <FaSpotify size={24} />
              </a>
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
