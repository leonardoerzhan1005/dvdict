import React, { useState, useEffect } from 'react';
import { dictionaryService, Term } from '../../../services/api/dictionaryService';
import { Language } from '../../../types';
import { Spinner } from '../../components/ui/Spinner';
import { WordCard } from '../../../components/ui/WordCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../src/hooks/useTranslation';
import { useAuth } from '../../../contexts/AuthContext';

const IconHeart = ({ size = 20, className = '', filled = false }: { size?: number; className?: string; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const FavoritesPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/#login';
      return;
    }
    loadFavorites();
  }, [language, user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const favs = await dictionaryService.getFavorites();
      setFavorites(favs);
      
      // Load full term data for each favorite
      const termPromises = favs.map((fav) =>
        dictionaryService.getTerm(fav.term_id, language).catch(() => null)
      );
      const loadedTerms = await Promise.all(termPromises);
      setTerms(loadedTerms.filter((t): t is Term => t !== null));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setTerms([]);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (termId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dictionaryService.removeFavorite(termId);
      // Update local state immediately
      setFavorites(prev => prev.filter(fav => fav.term_id !== termId));
      setTerms(prev => prev.filter(term => term.id !== termId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Ошибка при удалении из избранного');
    }
  };

  const handleTermClick = (termId: number) => {
    window.location.href = `/#terms/${termId}`;
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto animate-fade-up flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto animate-fade-up">
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-red-500 rounded-full"></div>
              <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em]">
                {t('navigation.favorites') as string}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white serif-modern tracking-tighter">
              {t('favorites.title') as string}
            </h1>
            <p className="text-zinc-400 font-medium mt-3 text-lg">
              {terms.length} {t('favorites.favorites') as string}
            </p>
          </div>
        </div>

        {/* Content */}
        {terms.length === 0 ? (
          <div className="bg-[#121214] border border-white/5 rounded-[3.5rem] p-20 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-600 border border-white/5">
                <IconHeart size={40} filled={false} />
              </div>
              <h3 className="text-2xl font-black text-white">{t('favorites.empty') as string}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t('favorites.emptyDescription') as string}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {terms.map((term) => {
              // Get category name
              const categoryName = term.category_id ? 'Category' : 'General';
              
              // Get translation based on current language
              const translation = term.title || '';
              const snippet = term.short_definition || term.definition || '';

              return (
                <div key={term.id} className="relative group">
                  <WordCard
                    item={{
                      word: term.title,
                      tag: categoryName,
                      translation: translation,
                      usageCount: term.views || 0,
                      snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
                      id: term.id,
                    }}
                    onClick={() => handleTermClick(term.id)}
                  />
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
