import { Language } from '../types';
import { LANGUAGE_NAMES } from '../constants';

export const getLanguageName = (lang: Language | string): string => {
  if (lang in LANGUAGE_NAMES) {
    return LANGUAGE_NAMES[lang as Language];
  }
  return lang;
};

export const isValidLanguage = (value: string): value is Language => {
  return Object.values(Language).includes(value as Language);
};

