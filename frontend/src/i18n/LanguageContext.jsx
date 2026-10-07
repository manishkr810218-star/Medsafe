import React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { translations } from "./translations.js";

const LanguageContext = createContext(null);
const KEY = "dic.lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() =>
    ["en", "hi", "ta"].includes(localStorage.getItem(KEY))
      ? localStorage.getItem(KEY)
      : "en",
  );

  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(
    () => setLang((l) => ({ en: "hi", hi: "ta", ta: "en" })[l]),
    [],
  );
  const t = translations[lang];
  // Pick the right language from translated content, falling back to English.
  const pick = useCallback((obj) => (obj ? (obj[lang] ?? obj.en) : ""), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle, setLang, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
