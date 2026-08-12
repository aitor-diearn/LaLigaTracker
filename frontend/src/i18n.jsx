import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./lang/es.json";
import en from "./lang/en.json";

const savedLanguage = localStorage.getItem('lang') || "es"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es
      },
      en: {
        translation: en
      }
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;