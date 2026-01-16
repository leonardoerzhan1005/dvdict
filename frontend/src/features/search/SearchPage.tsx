import React, { useState, useEffect, useCallback } from 'react';
import { searchService, SearchHit } from '../../../services/api/searchService';
import { dictionaryService } from '../../../services/api/dictionaryService';
import { Language } from '../../../types';
import { useDebounce } from '../../../hooks/useDebounce';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';

interface SearchPageProps {
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [lang, setLang] = useState<Language>(Language.RU);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [letter, setLetter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch();
    } else {
      setHits([]);
    }
  }, [debouncedQuery, lang, categoryId, letter, page]);

  const loadCategories = async () => {
    try {
      const cats = await dictionaryService.getCategories(lang);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const result = await searchService.search({
        q: debouncedQuery,
        lang,
        category_id: categoryId,
        letter: letter || undefined,
        page,
        size: 20,
      });
      setHits(result.items);
      setTotalPages(result.meta.pages);
    } catch (error) {
      console.error('Error searching:', error);
      setHits([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white/60 rounded-2xl p-6 shadow-lg border border-white/50">
        <div className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск терминов..."
            className="w-full bg-white border border-slate-200 rounded-lg px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Язык</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2"
              >
                <option value={Language.KK}>Қазақша</option>
                <option value={Language.RU}>Русский</option>
                <option value={Language.EN}>English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Категория</label>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2"
              >
                <option value="">Все категории</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Первая буква</label>
              <input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value.slice(0, 1).toUpperCase())}
                maxLength={1}
                placeholder="А"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : hits.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">Ничего не найдено</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hits.map((hit) => (
              <div
                key={hit.term_id}
                onClick={() => (window.location.href = `/#terms/${hit.term_id}`)}
                className="bg-white p-8 rounded-3xl border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-black text-slate-900 mb-2">{hit.title}</h3>
                {hit.short_definition && (
                  <p className="text-slate-600">{hit.short_definition}</p>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};
