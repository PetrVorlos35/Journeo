import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


const Loading = ({ fullScreen = false }) => {
    const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-center ${fullScreen ? "fixed inset-0 bg-white dark:bg-black bg-opacity-80 z-50" : "p-4"}`}>
      <div className="flex flex-col items-center">
        {/* Animovaný spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{t('loading')}</p>
      </div>
    </div>
  );
};

Loading.propTypes = {
  fullScreen: PropTypes.bool
};

export default Loading;
