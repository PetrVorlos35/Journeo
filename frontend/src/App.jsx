import LandingPage from './LandingPage';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Cesta k tvému souboru i18n

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div>
          <LandingPage />
      </div>
    </I18nextProvider>
  );
}

export default App;
