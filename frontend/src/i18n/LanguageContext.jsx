import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from './translations.js';

const LanguageContext = createContext(null);
const KEY = 'dic.lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(KEY) || 'en');

  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'hi' : 'en')), []);
  const t = translations[lang];
  // Pick the right language from a { en, hi } object (used for demo alert text)
  const pick = useCallback((obj) => (obj ? obj[lang] ?? obj.en : ''), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
