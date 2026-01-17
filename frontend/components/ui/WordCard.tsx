import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from './Badge';
import { useAuth } from '../../contexts/AuthContext';
import { dictionaryService } from '../../services/api/dictionaryService';

interface WordCardItem {
  word: string;
  tag: string;
  translation: string;
  usageCount: number;
  snippet: string;
  id?: number;
}

interface WordCardProps {
  item: WordCardItem;
  onClick: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ item, onClick }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const checkFavorite = useCallback(async () => {
    if (!isAuthenticated || !item.id) return;
    try {
      const favorites = await dictionaryService.getFavorites();
      setIsFavorite(favorites.some((f) => f.term_id === item.id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  }, [isAuthenticated, item.id]);

  useEffect(() => {
    if (isAuthenticated && item.id) {
      checkFavorite();
    }
  }, [isAuthenticated, item.id, checkFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      window.location.href = '/#login';
      return;
    }

    if (!item.id) return;

    try {
      if (isFavorite) {
        await dictionaryService.removeFavorite(item.id);
      } else {
        await dictionaryService.addFavorite(item.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div
      onClick={onClick}
      className="pop-card group bg-white p-8 rounded-3xl border border-slate-200 cursor-pointer flex flex-col justify-between min-h-[350px] relative"
    >
      {isAuthenticated && item.id && (
        <div className="absolute top-5 right-5 flex gap-4 z-20">
          <button 
            onClick={handleToggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl group ${isFavorite ? 'bg-blue-500 text-white' : 'bg-white text-slate-300 hover:text-blue-500 border border-slate-100'}`}
          >
             <svg className="w-7 h-7 group-active:scale-90 transition-transform" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      )}
      <div className="space-y-5 flex-1">
        <div className="flex justify-between items-start">
          <Badge>{item.tag}</Badge>
          <span className="text-xs font-bold text-slate-300">#{item.usageCount} lookups</span>
        </div>
        <div className="space-y-4">
          <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-900 transition-colors serif-modern">
            {item.word}
          </h4>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Описание</p>
            <p className="text-base text-slate-600 leading-relaxed font-medium">{item.snippet}</p>
          </div>
        </div>
      </div>
      <div className="pt-5 mt-5 border-t border-slate-50 flex items-center justify-between">
        <span className="text-base font-bold text-slate-500">{item.translation}</span>
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-900 group-hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

