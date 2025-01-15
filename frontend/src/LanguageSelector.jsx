import React, { useState } from 'react';
import i18n from 'i18next';
import Flags from 'react-world-flags';

const LanguageSelector = () => {
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLang(lng); // Aktualizuje aktuální jazyk
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        {/* Vlajka aktuálního jazyka */}
        <Flags
          code={selectedLang === 'cs' ? 'CZ' : 'GB'}
          className="w-6 h-4"
        />

        {/* Dropdown pro výběr jazyka */}
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={selectedLang}
          className="border border-gray-300 rounded-md py-1 px-2 text-sm bg-white cursor-pointer focus:ring focus:ring-blue-300"
        >
          <option value="cs">Čeština</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
