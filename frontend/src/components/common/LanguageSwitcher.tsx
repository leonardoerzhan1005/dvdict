import React from 'react';
import { Language } from '../../types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLangChange,
}) => {
  const languages: { code: Language; label: string }[] = [
    { code: Language.KK, label: 'Қаз' },
    { code: Language.RU, label: 'Рус' },
    { code: Language.EN, label: 'Eng' },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLangChange(lang.code)}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
            currentLang === lang.code
              ? 'bg-slate-900 text-white'
              : 'bg-white/60 text-slate-700 hover:bg-white'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
