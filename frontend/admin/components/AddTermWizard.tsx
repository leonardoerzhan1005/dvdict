import React, { useState, useEffect } from 'react';
import { AdminTermResult, TermStatus } from '../../types/admin';
import { Language } from '../../types';
import { adminService } from '../../services/api/adminService';
import { useTranslation } from '../../src/hooks/useTranslation';
import { Category } from '../../services/api/dictionaryService';

const IconX = ({ size = 12, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconChevronLeft = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconType = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 7 4 4 20 4 20 7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

const IconLayoutGrid = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconBookOpen = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const IconTag = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l8.59-8.59a1 1 0 0 0 0-1.41L12 2z"></path>
    <circle cx="7" cy="7" r="1.5"></circle>
  </svg>
);

const IconLanguages = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 8l6 6"></path>
    <path d="M4 14l6-6 2-3"></path>
    <path d="M2 5h12"></path>
    <path d="M7 2h1"></path>
    <path d="M22 22l-5-10-5 10"></path>
    <path d="M14 18h6"></path>
  </svg>
);

const IconSave = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const IconMic = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const IconPlay = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

const IconTrash2 = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconInfo = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

interface LanguageTabProps {
  lang: Language;
  active: boolean;
  onClick: () => void;
  isFilled: boolean;
}

const LanguageTab: React.FC<LanguageTabProps> = ({ lang, active, onClick, isFilled }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all border ${
      active 
        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
        : 'bg-[#0c0c0e] border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
    }`}
  >
    <span className="relative">
      {lang.toUpperCase()}
      {isFilled && !active && (
        <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
      )}
    </span>
    <IconLanguages size={14} className={active ? 'text-blue-200' : 'text-zinc-700'} />
  </button>
);

interface AddTermWizardProps {
  onBack: () => void;
  onSave: (term: AdminTermResult) => void;
  initialData?: AdminTermResult | null;
}

export const AddTermWizard: React.FC<AddTermWizardProps> = ({ onBack, onSave, initialData }) => {
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState<Language>(Language.EN);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termData, setTermData] = useState<AdminTermResult>({
    word: '',
    category: 'Technical',
    status: 'Draft',
    translations: { kk: '', ru: '', en: '' },
    definitions: {
      en: { meaning: '', description: '', examples: [], synonyms: [] },
      kk: { meaning: '', description: '', examples: [], synonyms: [] },
      ru: { meaning: '', description: '', examples: [], synonyms: [] }
    },
    morphology: '',
    etymology: '',
    pronunciation: '',
    tags: []
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const cats = await adminService.getCategories(Language.RU);
        setCategories(cats);
        // Устанавливаем первую категорию по умолчанию, если нет initialData
        if (!initialData && cats.length > 0) {
          setTermData(prev => ({
            ...prev,
            category_id: cats[0].id,
            category: cats[0].title,
          }));
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setTermData({
        ...initialData,
        tags: initialData.tags || [],
        category_id: (initialData as any).category_id,
        definitions: initialData.definitions || {
          en: { meaning: '', description: '', examples: [], synonyms: [] },
          kk: { meaning: '', description: '', examples: [], synonyms: [] },
          ru: { meaning: '', description: '', examples: [], synonyms: [] }
        },
        translations: initialData.translations || { kk: '', ru: '', en: '' },
      });
    }
  }, [initialData]);

  const updateField = (field: keyof AdminTermResult, value: any) => {
    setTermData(prev => ({ ...prev, [field]: value }));
  };

  const updateTranslation = (lang: Language, value: string) => {
    setTermData(prev => ({
      ...prev,
      translations: { ...prev.translations, [lang]: value }
    }));
  };

  const updateDefinition = (lang: Language, field: 'meaning' | 'description', value: string) => {
    setTermData(prev => ({
      ...prev,
      definitions: {
        ...(prev.definitions || {
          en: { meaning: '', description: '', examples: [], synonyms: [] },
          kk: { meaning: '', description: '', examples: [], synonyms: [] },
          ru: { meaning: '', description: '', examples: [], synonyms: [] }
        }),
        [lang]: {
          ...(prev.definitions?.[lang] || { meaning: '', description: '', examples: [], synonyms: [] }),
          [field]: value,
          examples: prev.definitions?.[lang]?.examples || [],
          synonyms: prev.definitions?.[lang]?.synonyms || []
        }
      }
    }));
  };

  const updateTags = (lang: Language, tags: string[]) => {
    // For now, tags are global, but we can make them language-specific if needed
    setTermData(prev => ({ ...prev, tags: tags }));
  };

  const isLangFilled = (lang: Language): boolean => {
    const translation = termData.translations?.[lang] || '';
    const meaning = termData.definitions?.[lang]?.meaning || '';
    return translation.length > 0 && meaning.length > 0;
  };

  const handleSave = async () => {
    setError(null);
    
    // Валидация: проверяем, что хотя бы один язык заполнен
    const hasTranslation = Object.values(termData.translations).some(t => t && t.trim().length > 0);
    const hasDefinition = Object.values(termData.definitions || {}).some(
      d => d?.meaning && d.meaning.trim().length > 0
    );
    
    if (!hasTranslation && !hasDefinition) {
      setError('Необходимо заполнить хотя бы один перевод и определение');
      return;
    }

    // Set the main word from English translation if not already set
    const finalData = { ...termData };
    if (!finalData.word && finalData.translations.en) {
      finalData.word = finalData.translations.en;
    }
    // Also set word from current active language if English is empty
    if (!finalData.word && finalData.translations[activeLang]) {
      finalData.word = finalData.translations[activeLang];
    }
    
    // Если нет category_id, но есть категория по названию, находим её
    if (!(finalData as any).category_id && finalData.category) {
      const foundCategory = categories.find(c => 
        c.title.toLowerCase() === finalData.category.toLowerCase()
      );
      if (foundCategory) {
        (finalData as any).category_id = foundCategory.id;
      }
    }

    setIsSaving(true);
    try {
      await onSave(finalData);
    } catch (err: any) {
      setError(err?.message || 'Ошибка при сохранении термина');
      console.error('Error saving term:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTranslation = termData.translations?.[activeLang] || '';
  const currentMeaning = termData.definitions?.[activeLang]?.meaning || '';
  const currentDescription = termData.definitions?.[activeLang]?.description || '';
  const currentTags = termData.tags || [];

  return (
    <div className="flex h-screen w-[73%]  pt-20 mx-auto bg-green text-zinc-300   font-sans overflow-hidden fixed inset-0 z-[100]">
       
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full border-r border-white/5">
        
        {/* Navigation Header */}
        <header className="h-16 pt-0 border-b border-white/5 flex items-center justify-between px-8 bg-[#050506]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
             
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-all"
            >
              <IconChevronLeft size={20} />
            </button>
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">
              Dictionary / <span className="text-blue-500">Add Word</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-zinc-500 flex gap-4 uppercase tracking-[0.2em]">
               <span className={isLangFilled(Language.EN) ? 'text-green-500' : ''}>EN</span>
               <span className={isLangFilled(Language.KK) ? 'text-green-500' : ''}>KK</span>
               <span className={isLangFilled(Language.RU) ? 'text-green-500' : ''}>RU</span>
             </div>
          </div>
        </header>

        {/* Form Area */}
        <main className="flex-1 overflow-y-auto p-12 admin-scrollbar pt-20">
          {error && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Language Selector Tabs */}
            <div className="flex items-center gap-3 bg-[#0c0c0e]/80 p-1.5 rounded-2xl border border-white/5 w-fit shadow-2xl">
              {([Language.EN, Language.KK, Language.RU] as Language[]).map(lang => (
                <LanguageTab 
                  key={lang} 
                  lang={lang} 
                  active={activeLang === lang} 
                  onClick={() => setActiveLang(lang)}
                  isFilled={isLangFilled(lang)}
                />
              ))}
            </div>

            {/* Language-specific Fields Section */}
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Title & Category Row */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <IconType size={14} className="text-blue-500" /> Title ({activeLang.toUpperCase()})
                  </label>
                  <input 
                    type="text" 
                    value={currentTranslation}
                    onChange={(e) => updateTranslation(activeLang, e.target.value)}
                    placeholder="Enter word title..."
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner placeholder:text-zinc-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <IconLayoutGrid size={14} className="text-purple-500" /> Category
                  </label>
                  {isLoadingCategories ? (
                    <div className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-zinc-500 text-sm">
                      Загрузка категорий...
                    </div>
                  ) : (
                    <select
                      value={(termData as any).category_id || ''}
                      onChange={(e) => {
                        const categoryId = parseInt(e.target.value);
                        const category = categories.find(c => c.id === categoryId);
                        setTermData(prev => ({
                          ...prev,
                          category_id: categoryId,
                          category: category?.title || '',
                        }));
                      }}
                      className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#0c0c0e]">
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Status Row */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <IconInfo size={14} className="text-yellow-500" /> Status
                </label>
                <select
                  value={termData.status || 'Draft'}
                  onChange={(e) => updateField('status', e.target.value as TermStatus)}
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner"
                >
                  <option value="Draft" className="bg-[#0c0c0e]">Draft</option>
                  <option value="Pending" className="bg-[#0c0c0e]">Pending</option>
                  <option value="Verified" className="bg-[#0c0c0e]">Verified</option>
                </select>
                <p className="text-[9px] text-zinc-600 italic">
                  Verified: сразу отображается на Home и Catalog. Draft/Pending: требует модерации.
                </p>
              </div>

              {/* Content Description */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <IconBookOpen size={14} className="text-teal-500" /> Content / Definition
                </label>
                <textarea 
                  rows={8}
                  value={currentMeaning}
                  onChange={(e) => updateDefinition(activeLang, 'meaning', e.target.value)}
                  placeholder="Describe the word in detail..."
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all leading-relaxed resize-none shadow-inner placeholder:text-zinc-700"
                />
              </div>

              {/* Extended Description */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <IconBookOpen size={14} className="text-indigo-500" /> Extended Description
                </label>
                <textarea 
                  rows={4}
                  value={currentDescription}
                  onChange={(e) => updateDefinition(activeLang, 'description', e.target.value)}
                  placeholder="Additional context and usage examples..."
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all leading-relaxed resize-none shadow-inner placeholder:text-zinc-700"
                />
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <IconTag size={14} className="text-orange-500" /> Tags
                </label>
                <div className="bg-[#0c0c0e] border border-white/10 rounded-xl p-4 flex flex-wrap gap-2 hover:border-zinc-700 transition-all">
                  {currentTags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-zinc-800/80 text-zinc-300 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-white/5">
                      #{tag}
                      <button 
                        onClick={() => updateTags(activeLang, currentTags.filter((_, i) => i !== idx))}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <IconX size={12} />
                      </button>
                    </div>
                  ))}
                  <input 
                    placeholder="+ Add tag..."
                    className="bg-transparent border-none outline-none text-xs px-2 text-white placeholder:text-zinc-700 w-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !currentTags.includes(val)) {
                          updateTags(activeLang, [...currentTags, val]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="h-20 border-t border-white/5 bg-[#050506]/95 backdrop-blur-xl flex items-center justify-between px-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
               <IconSave size={20} />
             </div>
             <div>
               <p className="text-[11px] font-black text-white uppercase tracking-wider">Word Management</p>
               <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Draft version 2.4</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={onBack}
               className="px-6 py-3 text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
             >
               Discard
             </button>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="px-10 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
             >
               {isSaving ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Create Entry')}
             </button>
          </div>
        </footer>
      </div>

      {/* SIDEBAR: PRONUNCIATION (Global for the word) */}
      <aside className="w-[400px] bg-[#080809] flex flex-col p-8 border-l border-white/5">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">Audio & Media</h2>
        
        <div className="space-y-8">
          <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-2xl space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Main Audio</span>
                <span className="text-[10px] font-mono text-blue-500">EN-V1.WAV</span>
             </div>
             <div className="flex items-center gap-4">
                <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-900/20 hover:bg-blue-500 transition-colors">
                  <IconPlay size={20} className="text-white" />
                </button>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full w-1/3 bg-blue-500"></div>
                </div>
             </div>
             <button className="w-full py-3 bg-zinc-900 text-zinc-500 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-colors">
               <IconMic size={14} /> Replace Recording
             </button>
          </div>

          {/* Pronunciation */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pronunciation</label>
            <input 
              type="text" 
              value={termData.pronunciation || ''}
              onChange={(e) => updateField('pronunciation', e.target.value)}
              placeholder="/ˈpronənsiˌāSH(ə)n/"
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner placeholder:text-zinc-700"
            />
          </div>

          {/* Morphology */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Morphology</label>
            <input 
              type="text" 
              value={termData.morphology || ''}
              onChange={(e) => updateField('morphology', e.target.value)}
              placeholder="e.g. Noun, Neutral"
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner placeholder:text-zinc-700"
            />
          </div>

          {/* Etymology */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Etymology</label>
            <textarea 
              rows={4}
              value={termData.etymology || ''}
              onChange={(e) => updateField('etymology', e.target.value)}
              placeholder="Document linguistic provenance..."
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all resize-none shadow-inner placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Usage Context</label>
            <div className="p-4 border border-white/5 rounded-xl bg-blue-500/5 flex items-start gap-4">
               <IconInfo className="text-blue-500 mt-1" size={16} />
               <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                 "Title and Category are synced across translations to maintain dictionary integrity, but can be translated as shown above."
               </p>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
           <button 
             onClick={() => {
               if (confirm('Are you sure you want to delete this entry?')) {
                 onBack();
               }
             }}
             className="w-full py-4 border border-red-500/10 bg-red-500/5 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all"
           >
             <IconTrash2 size={16} /> Delete Entire Entry
           </button>
        </div>
      </aside>
    </div>
  );
};



