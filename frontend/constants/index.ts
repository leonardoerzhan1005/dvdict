import { Language, TermResult } from '../types';

export const FREQUENT_TERMS: Array<{
  word: string;
  lang: Language;
  tag: string;
  translation: string;
  usageCount: number;
  snippet: string;
}> = [
  { 
    word: 'Sovereignty', 
    lang: Language.EN, 
    tag: 'Political', 
    translation: 'Егемендік', 
    usageCount: 1250, 
    snippet: 'Supreme power or authority over a territory, especially in political context. The ability of a state to govern itself without external interference.' 
  },
  { 
    word: 'Infrastructure', 
    lang: Language.EN, 
    tag: 'Urban', 
    translation: 'Инфрақұрылым', 
    usageCount: 980, 
    snippet: 'The basic physical and organizational structures and facilities needed for the operation of a society or enterprise, including transportation, communication, and utilities.' 
  },
  { 
    word: 'Digitalization', 
    lang: Language.EN, 
    tag: 'Tech', 
    translation: 'Цифрландыру', 
    usageCount: 2100, 
    snippet: 'The process of converting information into digital format or using digital technologies to transform business processes and operations for improved efficiency.' 
  },
  { 
    word: 'Heritage', 
    lang: Language.EN, 
    tag: 'Culture', 
    translation: 'Мұра', 
    usageCount: 450, 
    snippet: 'Property that is or may be inherited; valued objects and qualities passed down from previous generations, including cultural traditions and historical artifacts.' 
  },
  { 
    word: 'Investment', 
    lang: Language.EN, 
    tag: 'Finance', 
    translation: 'Инвестиция', 
    usageCount: 1120, 
    snippet: 'The action or process of investing money for profit or material result. Allocating resources with the expectation of generating income or appreciation over time.' 
  },
  { 
    word: 'Sustainability', 
    lang: Language.EN, 
    tag: 'Environment', 
    translation: 'Тұрақтылық', 
    usageCount: 890, 
    snippet: 'The ability to be maintained at a certain rate or level, especially regarding environmental and economic practices that meet current needs without compromising future generations.' 
  },
];

export const CATEGORIES = ['All', 'Tech', 'Political', 'Legal', 'Urban', 'Finance'] as const;

export const LANGUAGE_NAMES: Record<Language, string> = {
  [Language.KK]: 'Kazakh',
  [Language.RU]: 'Russian',
  [Language.EN]: 'English',
};

export const STORAGE_KEYS = {
  HISTORY: 'polyglot_history',
} as const;

