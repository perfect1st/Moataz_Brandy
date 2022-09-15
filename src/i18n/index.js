import i18n from 'i18next';
import { initReactI18next } from "react-i18next"
import ar from './ar.json';
import en from './en.json';

// the translations
const resources = {
  ar: {
    translation: ar
  },
  en: {
    translation: en
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // default language to use
  keySeparator: false, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
