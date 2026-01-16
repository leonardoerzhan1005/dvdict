import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SearchState, Language, TermResult } from '../types';
import { fetchTermDetails } from '../services/termApiService';
import { LanguageSelector } from '../components/LanguageSelector';
import { ResultCard } from '../components/ResultCard';
import { WordCard } from '../components/ui/WordCard';
import { useHistory } from '../hooks/useHistory';
import { dictionaryService, Category } from '../services/api/dictionaryService';
import { searchService } from '../services/api/searchService';
import { Spinner } from '../src/components/ui/Spinner';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../src/hooks/useTranslation';

interface HomePageProps {
  onNavigateToCatalog: () => void;
  initialQuery?: string;
  onMounted?: () => void;
}

export type SortOption = 'usage' | 'alpha';

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToCatalog, initialQuery, onMounted }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('usage');
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTerms, setPopularTerms] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const { history, addToHistory } = useHistory();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const [state, setState] = useState<SearchState>({
    query: initialQuery || '',
    from: Language.EN,
    to: Language.KK,
    loading: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    loadCategories();
    loadPopularTerms();
  }, [language]);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const cats = await dictionaryService.getCategories(language);
      console.log('Loaded categories:', cats);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadPopularTerms = async () => {
    setIsLoadingTerms(true);
    try {
      const terms = await dictionaryService.getTerms(language, {
        status: 'approved',
        page: 1,
        size: 20,
      });
      console.log('Loaded terms:', terms);
      const sorted = terms.sort((a, b) => b.views - a.views);
      const mapped = sorted.slice(0, 6).map(term => ({
        term_id: term.id,
        id: term.id,
        title: term.title,
        short_definition: term.short_definition,
        definition: term.definition,
        category_id: term.category_id,
        views: term.views,
      }));
      console.log('Mapped popular terms:', mapped);
      setPopularTerms(mapped);
    } catch (error) {
      console.error('Error loading popular terms:', error);
      setPopularTerms([]);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSearch(initialQuery);
      onMounted?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const filteredTerms = useMemo(() => {
    let filtered = [...popularTerms];
    
    if (activeCategory) {
      filtered = filtered.filter((term) => term.category_id === activeCategory);
    }

    if (sortBy === 'usage') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [popularTerms, activeCategory, sortBy]);

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
    <>
      <section
        className={`transition-all duration-700 ease-in-out ${
          state.result 
            ? ' py-10 border-b' 
            : ' py-32 px-6 relative overflow-hidden'
        }`}
      >
        {!state.result && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] b rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%]  rounded-full"></div>
          </div>
        )}

        <div className="max-w-[1440px] mx-auto  relative z-10 space-y-12">
          {!state.result && (
            <div className="text-center space-y-6">
              <h1 className="text-blue-900 text-5xl md:text-7xl font-black tracking-tighter serif-modern leading-[1.1]">
                {t('home.title')}
              </h1>
              <p className="text-blue-900 font-bold text-lg max-w-lg mx-auto uppercase tracking-widest">
                {t('home.subtitle')}
              </p>
            </div>
          )}

          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center bg-white rounded-3xl shadow-3xl shadow-blue-900/20 overflow-hidden p-2 focus-within:ring-8 focus-within:ring-white/10 transition-all h-[80px]"
            >
              <div className="hidden md:flex items-center px-4 shrink-0 h-full">
                <div className="flex items-center gap-1 bg-blue-50/80 rounded-3xl px-3 py-1.5 border border-slate-100">
                  <LanguageSelector 
                    value={state.from} 
                    onChange={(v) => setState(p => ({...p, from: v}))} 
                    excludeLanguage={state.to}
                  />
                  <button 
                    onClick={swapLanguages}
                    className="w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all hover:rotate-180 duration-500"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </button>
                  <LanguageSelector 
                    value={state.to} 
                    onChange={(v) => setState(p => ({...p, to: v}))} 
                    excludeLanguage={state.from}
                  />
                </div>
              </div>

              <input
                type="text"
                value={state.query}
                onChange={(e) => setState((p) => ({ ...p, query: e.target.value }))}
                placeholder="Enter a professional term..."
                className="flex-1 bg-transparent py-4 px-6 text-xl outline-none text-slate-800 placeholder:text-slate-400 font-bold"
              />

              <button
                type="submit"
                disabled={state.loading}
                className="bg-blue-900 hover:bg-blue-800 text-white px-10 rounded-3xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 h-full flex items-center gap-3"
              >
                {state.loading ? (
                  <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {t('common.search')}{' '}
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

          {state.error && (
            <div className="bg-rose-500 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/10 animate-in slide-in-from-top-4">
              {state.error}
            </div>
          )}
        </div>
      </section>

      <div className="w-full px-6 sm:px-12 py-16">
        {state.result ? (
          <>
            {/* BACK BUTTON COMPONENT */}
            <div className="w-[1440px] mx-auto flex items-center mb-4 ">
              <button 
                onClick={goBack}
                className="group flex items-center gap-3  text-white hover:text-white-100 transition-all font-black text-[10px] uppercase tracking-[0.3em] bg-blue-900 px-6 py-3 rounded-full border border-slate-100 shadow-sm hover:shadow-md active:scale-95"
              >
                <svg 
                  className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('home.backToExplore') as string}
              </button>
            </div>
            <ResultCard result={state.result} targetLang={state.to} />
          </>
        ) : (
          <div className="space-y-32">
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                    {t('home.popularTerms') as string}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {t('home.subtitle') as string}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <button
                    onClick={onNavigateToCatalog}
                    className="px-6 py-3 bg-blue-900 text-white rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all"
                  >
                    {t('navigation.catalog') as string}
                  </button>
                  <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200">
                    <button
                      onClick={() => setSortBy('usage')}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${
                        sortBy === 'usage'
                          ? 'bg-white shadow-sm text-blue-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {t('home.sortByUsage') as string}
                    </button>
                    <button
                      onClick={() => setSortBy('alpha')}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${
                        sortBy === 'alpha'
                          ? 'bg-white shadow-sm text-blue-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {t('home.sortByAlpha') as string}
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`px-4 py-2 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeCategory === null
                          ? 'bg-blue-900 text-white shadow-lg shadow-blue-100'
                          : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-600'
                      }`}
                    >
                      {t('common.all') as string}
                    </button>
                    {isLoadingCategories ? (
                      <Spinner size="sm" />
                    ) : (
                      categories.slice(0, 6).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-4 py-2 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeCategory === cat.id
                              ? 'bg-blue-900 text-white shadow-lg shadow-blue-100'
                              : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-600'
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
              ) : filteredTerms.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-600">{t('home.noResults') as string}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTerms.map((term) => (
                    <div
                      key={term.term_id || term.id}
                      onClick={() => {
                        const termId = term.term_id || term.id;
                        window.location.href = `/#terms/${termId}`;
                      }}
                      className="pop-card group bg-white p-8 rounded-3xl border border-slate-200 cursor-pointer flex flex-col justify-between min-h-[350px] hover:shadow-lg transition-shadow"
                    >
                      <div className="space-y-5 flex-1">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-900 text-white">
                            {categories.find(c => c.id === term.category_id)?.title || 'Term'}
                          </span>
                          <span className="text-xs font-bold text-slate-300">
                            #{term.views || 0} views
                          </span>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-900 transition-colors serif-modern">
                            {term.title}
                          </h4>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('terms.definition') as string}</p>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">
                              {term.short_definition || term.definition?.slice(0, 150) || t('terms.notFound') as string}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-5 mt-5 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-base font-bold text-slate-500">{term.title}</span>
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-900 group-hover:text-white transition-all">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden min-h-[400px] flex flex-col justify-end">
                  <div className="absolute top-12 left-12 inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Featured Mapping
                    </span>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <h2 className="text-6xl font-black serif-modern">Pragmatism</h2>
                    <p className="text-xl text-slate-400 font-medium max-w-xl italic">
                      The transition from ideological rigidity to practical governance results
                      in the concept of pragmatism.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleSearch('Pragmatism')}
                        className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all"
                      >
                        Deep Dive
                      </button>
                      <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/10">
                        Add to List
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-[60%] h-full opacity-10 pointer-events-none">
                    <svg
                      className="w-full h-full"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
                    Recent Activity
                  </h4>
                  <div className="space-y-4">
                    {history.length > 0 ? (
                      history.map((w) => (
                        <button
                          key={w}
                          onClick={() => handleSearch(w)}
                          className="block w-full text-left font-black text-slate-700 hover:text-blue-900 transition-all text-lg group"
                        >
                          {w}
                          <span className="block h-0.5 w-0 group-hover:w-full bg-indigo-50 transition-all duration-300"></span>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 font-medium py-4">
                        Search terms will appear here.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-900 border border-blue-100 rounded-[2.5rem] p-10">
                  <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-6">
                    Expert Contributions
                  </h4>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-blue-900/60 leading-relaxed">
                      Join 500+ linguists standardizing the professional terminology of Central
                      Asia.
                    </p>
                    <button className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all">
                      Contributor Portal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

