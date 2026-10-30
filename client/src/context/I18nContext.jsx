import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

const STORAGE_KEY = 'inkreate_lang';

const I18nContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key) => {
      const langTable = translations[language] || translations.en;
      return langTable[key] || translations.en[key] || key;
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
