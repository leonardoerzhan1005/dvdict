import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { WordCard } from '../components/ui/WordCard';
import { Language, SearchState } from '../types';
import { LanguageSelector } from '../components/LanguageSelector';
import { useHistory } from '../hooks/useHistory';
import { fetchTermDetails } from '../services/termApiService';
import { dictionaryService, Category } from '../services/api/dictionaryService';
import { Spinner } from '../src/components/ui/Spinner';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../src/hooks/useTranslation';

type SortOption = 'usage' | 'alpha';







interface CatalogPageProps {
  onTermClick: (word: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onTermClick }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('usage');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const { history, addToHistory } = useHistory();
  const { language } = useLanguage();
  const { t } = useTranslation(); 



    const [state, setState] = useState<SearchState>({
      query: searchQuery || '',
      from: Language.EN,
      to: Language.KK,
      loading: false,
      result: null,
      error: null,
    });
  
  useEffect(() => {
    loadCategories();
    loadTerms();
  }, [language]);

  useEffect(() => {
    loadTerms();
  }, [activeCategory, sortBy, language]);

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const cats = await dictionaryService.getCategories(language);
      console.log('Catalog: Loaded categories:', cats);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadTerms = async () => {
    setIsLoadingTerms(true);
    try {
      const loadedTerms = await dictionaryService.getTerms(language, {
        category_id: activeCategory || undefined,
        status: 'approved',
        page: 1,
        size: 100,
      });
      console.log('Catalog: Loaded terms:', loadedTerms);
      setTerms(loadedTerms);
    } catch (error) {
      console.error('Error loading terms:', error);
      setTerms([]);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  const filteredTerms = useMemo(() => {
    let filtered = [...terms];

    if (sortBy === 'usage') {
      filtered.sort((a, b) => b.views - a.views);
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [terms, sortBy]);
  
    const handleSearch = useCallback(
      async (forcedQuery?: string) => {
        const queryToSearch = forcedQuery || state.query;
        if (!queryToSearch.trim()) return;
  
        setState((prev) => ({
          ...prev,
          query: queryToSearch,
          loading: true,
          error: null,
          result: null,
        }));
  
        try {
          const result = await fetchTermDetails(queryToSearch, state.from, state.to);
          setState((prev) => ({ ...prev, result, loading: false }));
          addToHistory(queryToSearch);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Термин не найден. Пожалуйста, проверьте правописание или попробуйте другую языковую пару.';
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        }
      },
      [state.query, state.from, state.to, addToHistory]
    );
  
    const swapLanguages = useCallback(() => {
      setState((p) => ({ ...p, from: p.to, to: p.from, result: null }));
    }, []);
  
    const goBack = useCallback(() => {
      setState((p) => ({ ...p, result: null, query: '', error: null }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);



  return (
    <div className="w-full px-6 sm:px-12 py-16">
      <div className="space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter serif-modern">
            {t('catalog.title') as string}
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            {t('catalog.subtitle') as string}
          </p>
        </div>

         

        <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center bg-white rounded-3xl shadow-2xl shadow-indigo-900/20 overflow-hidden p-2 focus-within:ring-8 focus-within:ring-white/10 transition-all h-[80px]"
            >
              <div className="hidden md:flex items-center px-4 shrink-0 h-full">
                <div className="flex items-center gap-1 bg-slate-50/80 rounded-3xl px-3 py-1.5 border border-slate-100">
                  <LanguageSelector 
                    excludeLanguage={state.to}
                    onLanguageChange={(v) => setState(p => ({...p, from: v}))}
                  />
                  <button 
                    onClick={swapLanguages}
                    className="w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all hover:rotate-180 duration-500"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </button>
                  <LanguageSelector 
                    excludeLanguage={state.from}
                    onLanguageChange={(v) => setState(p => ({...p, to: v}))}
                  />
                </div>
              </div>

              <input
                type="text"
                value={state.query}
                onChange={(e) => setState((p) => ({ ...p, query: e.target.value }))}
                placeholder={t('catalog.searchPlaceholder') as string}
                className="flex-1 bg-transparent py-4 px-6 text-xl outline-none text-slate-800 placeholder:text-slate-400 font-bold"
              />

              <button
                type="submit"
                disabled={state.loading}
                className="bg-blue-900 hover:bg-indigo-700 text-white px-10 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 h-full flex items-center gap-3"
              >
                {state.loading ? (
                  <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    SEARCH{' '}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {t('catalog.found') as string}: {filteredTerms.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200">
              <button
                onClick={() => setSortBy('usage')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${
                  sortBy === 'usage'
                    ? 'bg-white shadow-sm text-blue-900'
                    : 'text-slate-400'
                }`}
              >
                {t('catalog.sortByUsage') as string}
              </button>
              <button
                onClick={() => setSortBy('alpha')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${
                  sortBy === 'alpha'
                    ? 'bg-white shadow-sm text-blue-900'
                    : 'text-slate-400'
                }`}
              >
                {t('catalog.sortByAlpha') as string}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === null
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-100'
                    : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-900'
                }`}
              >
                {t('common.all') as string}
              </button>
              {isLoadingCategories ? (
                <Spinner size="sm" />
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat.id
                        ? 'bg-blue-900 text-white shadow-lg shadow-blue-100'
                        : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-900'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {isLoadingTerms ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => {
              const category = categories.find(c => c.id === term.category_id);
              const wordCardItem = {
                word: term.title,
                tag: category?.title || 'Term',
                translation: term.title,
                usageCount: term.views || 0,
                snippet: term.short_definition || term.definition?.slice(0, 150) || 'Нет описания',
                id: term.id,
              };
              return (
                <WordCard
                  key={term.id}
                  item={wordCardItem}
                  onClick={() => {
                    window.location.href = `/#terms/${term.id}`;
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium text-lg">
              {t('catalog.noTerms') as string}. {t('catalog.tryDifferentFilters') as string}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

