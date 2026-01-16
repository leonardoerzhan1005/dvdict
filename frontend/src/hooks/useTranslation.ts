import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  return {
    t: (key: string, options?: any) => {
      const result = t(key, options);
      return typeof result === 'string' ? result : String(result);
    },
    currentLanguage: i18n.language,
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
  };
};

export type TranslationFunction = (key: string, options?: any) => string;
