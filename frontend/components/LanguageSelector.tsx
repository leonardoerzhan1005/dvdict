
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  value?: Language;
  onChange?: (lang: Language) => void;
  excludeLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
  label?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  value, 
  onChange, 
  excludeLanguage, 
  onLanguageChange 
}) => {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  
  const isControlled = value !== undefined && onChange !== undefined;
  const currentLanguage = isControlled ? value : globalLanguage;
  
  const handleLanguageChange = (lang: Language) => {
    if (isControlled) {
      onChange!(lang);
    } else {
      setGlobalLanguage(lang);
    }
    onLanguageChange?.(lang);
    setIsLangMenuOpen(false);
  };
  
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangMenuOpen(false);
      }
    };

    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isLangMenuOpen]);

  const availableLanguages = Object.values(Language).filter(
    (lang) => lang !== excludeLanguage
  );

  return (
    <div className="relative" ref={langMenuRef}>
      <button 
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className={`w-[68px] h-[48px] flex items-center justify-center rounded-full text-[15px] font-bold transition-all border shadow-sm ${
          isLangMenuOpen 
            ? 'bg-white border-[#3b82f6]/30 text-[#1a2b56]' 
            : 'bg-[#e7f3ff] border-[#d7e9ff] text-[#5e78a2] hover:bg-white'
        }`}
        aria-expanded={isLangMenuOpen}
        aria-haspopup="true"
      >
        {currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}
      </button>
      
      {isLangMenuOpen && (
        <div className="absolute top-[60px] left-0 bg-[#f0f7ff] rounded-[2rem] p-1.5 border border-[#e0efff] shadow-[0_15px_40px_rgba(59,130,246,0.1)] flex flex-col gap-1.5 animate-fade-up min-w-[68px] z-50">
          {availableLanguages.map((lang) => (
            <button 
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className="w-full h-[48px] flex items-center justify-center rounded-full bg-[#dbeafe] text-[#1a2b56] text-[15px] font-bold hover:bg-white transition-all border border-[#c3deff]"
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
