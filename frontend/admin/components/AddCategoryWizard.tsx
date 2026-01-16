import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { dictionaryService, Category, CategoryCreateRequest, CategoryTranslation } from '../../services/api/dictionaryService';
import { useTranslation } from '../../src/hooks/useTranslation';

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

const IconBookOpen = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
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

interface AddCategoryWizardProps {
  onBack: () => void;
  onSave: (category: Category) => void;
  initialData?: Category | null;
}

export const AddCategoryWizard: React.FC<AddCategoryWizardProps> = ({ onBack, onSave, initialData }) => {
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState<Language>(Language.EN);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [categoryData, setCategoryData] = useState<{
    slug: string;
    parent_id: number | null;
    translations: {
      [key in Language]?: { title: string; description: string };
    };
  }>({
    slug: '',
    parent_id: null,
    translations: {
      en: { title: '', description: '' },
      kk: { title: '', description: '' },
      ru: { title: '', description: '' },
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const cats = await dictionaryService.getCategories(Language.RU);
        setCategories(cats);
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
      // Загружаем переводы для всех языков
      const loadTranslations = async () => {
        try {
          const [catRu, catKz, catEn] = await Promise.all([
            dictionaryService.getCategory(initialData.id, Language.RU).catch(() => null),
            dictionaryService.getCategory(initialData.id, Language.KK).catch(() => null),
            dictionaryService.getCategory(initialData.id, Language.EN).catch(() => null),
          ]);

          setCategoryData({
            slug: initialData.slug,
            parent_id: initialData.parent_id,
            translations: {
              ru: { title: catRu?.title || '', description: catRu?.description || '' },
              kk: { title: catKz?.title || '', description: catKz?.description || '' },
              en: { title: catEn?.title || '', description: catEn?.description || '' },
            },
          });
        } catch (err) {
          console.error('Error loading category translations:', err);
        }
      };
      loadTranslations();
    }
  }, [initialData]);

  const updateTranslation = (lang: Language, field: 'title' | 'description', value: string) => {
    setCategoryData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value,
        },
      },
    }));
    
    // Автоматически генерируем slug из английского названия, если slug пустой
    if (lang === Language.EN && field === 'title' && !prev.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9а-яё-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setCategoryData(prev => ({ ...prev, slug }));
    }
  };

  const isLangFilled = (lang: Language): boolean => {
    const translation = categoryData.translations[lang];
    return translation?.title ? translation.title.trim().length > 0 : false;
  };

  const handleSave = async () => {
    setError(null);
    
    // Валидация: проверяем, что хотя бы один язык заполнен
    const hasTranslation = Object.values(categoryData.translations).some(
      t => t?.title && t.title.trim().length > 0
    );
    
    if (!hasTranslation) {
      setError('Необходимо заполнить хотя бы один перевод');
      return;
    }

    if (!categoryData.slug.trim()) {
      setError('Необходимо указать slug (генерируется автоматически из названия)');
      return;
    }

    // Формируем переводы для API
    const translations: CategoryTranslation[] = [];
    
    if (categoryData.translations.ru?.title) {
      translations.push({
        language: 'ru',
        title: categoryData.translations.ru.title,
        description: categoryData.translations.ru.description || undefined,
      });
    }
    
    if (categoryData.translations.kk?.title) {
      translations.push({
        language: 'kz',
        title: categoryData.translations.kk.title,
        description: categoryData.translations.kk.description || undefined,
      });
    }
    
    if (categoryData.translations.en?.title) {
      translations.push({
        language: 'en',
        title: categoryData.translations.en.title,
        description: categoryData.translations.en.description || undefined,
      });
    }

    if (translations.length === 0) {
      setError('Необходимо заполнить хотя бы один перевод');
      return;
    }

    const createData: CategoryCreateRequest = {
      slug: categoryData.slug,
      parent_id: categoryData.parent_id || undefined,
      translations,
    };

    setIsSaving(true);
    try {
      if (initialData) {
        const updated = await dictionaryService.updateCategory(initialData.id, createData, Language.RU);
        onSave(updated);
      } else {
        const created = await dictionaryService.createCategory(createData);
        onSave(created);
      }
    } catch (err: any) {
      setError(err?.message || 'Ошибка при сохранении категории');
      console.error('Error saving category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTitle = categoryData.translations[activeLang]?.title || '';
  const currentDescription = categoryData.translations[activeLang]?.description || '';

  return (
    <div className="flex h-screen w-[73%] pt-20 mx-auto bg-green text-zinc-300 font-sans overflow-hidden fixed inset-0 z-[100]">
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
              Dictionary / <span className="text-blue-500">{initialData ? 'Edit Category' : 'Add Category'}</span>
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
              
              {/* Title & Parent Category Row */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <IconType size={14} className="text-blue-500" /> Title ({activeLang.toUpperCase()})
                  </label>
                  <input 
                    type="text" 
                    value={currentTitle}
                    onChange={(e) => updateTranslation(activeLang, 'title', e.target.value)}
                    placeholder="Enter category title..."
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner placeholder:text-zinc-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <IconType size={14} className="text-purple-500" /> Parent Category (Optional)
                  </label>
                  {isLoadingCategories ? (
                    <div className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-zinc-500 text-sm">
                      Загрузка категорий...
                    </div>
                  ) : (
                    <select
                      value={categoryData.parent_id || ''}
                      onChange={(e) => {
                        const parentId = e.target.value ? parseInt(e.target.value) : null;
                        setCategoryData(prev => ({ ...prev, parent_id: parentId }));
                      }}
                      className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner"
                    >
                      <option value="" className="bg-[#0c0c0e]">No parent (root category)</option>
                      {categories.filter(c => !initialData || c.id !== initialData.id).map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#0c0c0e]">
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Slug */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <IconType size={14} className="text-teal-500" /> Slug (URL identifier)
                </label>
                <input 
                  type="text" 
                  value={categoryData.slug}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9а-яё-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                    setCategoryData(prev => ({ ...prev, slug }));
                  }}
                  placeholder="category-slug"
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner placeholder:text-zinc-700 font-mono text-sm"
                />
                <p className="text-[9px] text-zinc-600 italic">
                  Автоматически генерируется из английского названия. Можно изменить вручную.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <IconBookOpen size={14} className="text-indigo-500" /> Description ({activeLang.toUpperCase()})
                </label>
                <textarea 
                  rows={4}
                  value={currentDescription}
                  onChange={(e) => updateTranslation(activeLang, 'description', e.target.value)}
                  placeholder="Category description..."
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all leading-relaxed resize-none shadow-inner placeholder:text-zinc-700"
                />
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
              <p className="text-[11px] font-black text-white uppercase tracking-wider">Category Management</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Version 1.0</p>
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
              {isSaving ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Create Category')}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
