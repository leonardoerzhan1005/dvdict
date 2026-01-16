import React, { useState, useEffect } from 'react';
import { dictionaryService, Category, Term } from '../../../services/api/dictionaryService';
import { Language } from '../../../types';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';

interface CategoryPageProps {
  categoryId: number;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [lang, setLang] = useState<Language>(Language.RU);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categoryId, lang, page]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedCategory, loadedTerms] = await Promise.all([
        dictionaryService.getCategory(categoryId, lang),
        dictionaryService.getTerms(lang, {
          category_id: categoryId,
          page,
          size: 20,
        }),
      ]);
      setCategory(loadedCategory);
      setTerms(loadedTerms);
      setTotalPages(Math.ceil(loadedTerms.length / 20));
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-slate-600 text-lg">Категория не найдена</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">{category.title}</h1>
          {category.description && (
            <p className="text-slate-600">{category.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLang(Language.KK)}
            className={`px-4 py-2 rounded-lg font-bold ${
              lang === Language.KK ? 'bg-slate-900 text-white' : 'bg-white/60'
            }`}
          >
            Қаз
          </button>
          <button
            onClick={() => setLang(Language.RU)}
            className={`px-4 py-2 rounded-lg font-bold ${
              lang === Language.RU ? 'bg-slate-900 text-white' : 'bg-white/60'
            }`}
          >
            Рус
          </button>
          <button
            onClick={() => setLang(Language.EN)}
            className={`px-4 py-2 rounded-lg font-bold ${
              lang === Language.EN ? 'bg-slate-900 text-white' : 'bg-white/60'
            }`}
          >
            Eng
          </button>
        </div>
      </div>

      {terms.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">В этой категории пока нет терминов</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {terms.map((term) => (
              <div
                key={term.id}
                onClick={() => (window.location.href = `/#terms/${term.id}`)}
                className="bg-white p-8 rounded-3xl border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-black text-slate-900 mb-2">{term.title}</h3>
                {term.short_definition && (
                  <p className="text-slate-600">{term.short_definition}</p>
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
