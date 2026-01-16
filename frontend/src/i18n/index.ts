import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import kzTranslations from './kz.json';
import ruTranslations from './ru.json';
import enTranslations from './en.json';

const getStoredLanguage = (): string => {
  const stored = localStorage.getItem('appLanguage');
  if (stored && ['kk', 'ru', 'en'].includes(stored)) {
    return stored;
  }
  return 'ru';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      kk: { translation: kzTranslations },
      ru: { translation: ruTranslations },
      en: { translation: enTranslations },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('appLanguage', lng);
});

export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
};

export default i18n;
