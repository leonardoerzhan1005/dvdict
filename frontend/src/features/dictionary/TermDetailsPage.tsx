import React, { useState, useEffect } from 'react';
import { dictionaryService, Term } from '../../../services/api/dictionaryService';
import { useAuth } from '../../../contexts/AuthContext';
import { Language, TermResult, Definition } from '../../../types';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { ResultCard } from '../../../components/ResultCard';
import { useTranslation } from '../../../src/hooks/useTranslation';

interface TermDetailsPageProps {
  termId: number;
}

export const TermDetailsPage: React.FC<TermDetailsPageProps> = ({ termId }) => {
  const [term, setTerm] = useState<Term | null>(null);
  const [termResult, setTermResult] = useState<TermResult | null>(null);
  const [lang, setLang] = useState<Language>(Language.RU);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    loadTerm();
    checkFavorite();
  }, [termId, lang]);

  const loadTerm = async () => {
    setIsLoading(true);
    try {
      const loadedTerm = await dictionaryService.getTerm(termId, lang);
      setTerm(loadedTerm);
      
      const translations: Record<Language, string> = {
        [Language.KK]: '',
        [Language.RU]: '',
        [Language.EN]: '',
      };
      
      const definitions: Record<Language, Definition> = {
        [Language.KK]: {
          meaning: '',
          examples: [],
          synonyms: [],
        },
        [Language.RU]: {
          meaning: '',
          examples: [],
          synonyms: [],
        },
        [Language.EN]: {
          meaning: '',
          examples: [],
          synonyms: [],
        },
      };

      const langPromises = [
        dictionaryService.getTerm(termId, Language.KK).catch(() => null),
        dictionaryService.getTerm(termId, Language.RU).catch(() => null),
        dictionaryService.getTerm(termId, Language.EN).catch(() => null),
      ];

      const [termKZ, termRU, termEN] = await Promise.all(langPromises);

      if (termKZ) {
        translations[Language.KK] = termKZ.title;
        definitions[Language.KK] = {
          meaning: termKZ.definition,
          examples: termKZ.examples ? termKZ.examples.split('\n').filter(Boolean) : [],
          synonyms: termKZ.synonyms ? termKZ.synonyms.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
      }

      if (termRU) {
        translations[Language.RU] = termRU.title;
        definitions[Language.RU] = {
          meaning: termRU.definition,
          examples: termRU.examples ? termRU.examples.split('\n').filter(Boolean) : [],
          synonyms: termRU.synonyms ? termRU.synonyms.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
      }

      if (termEN) {
        translations[Language.EN] = termEN.title;
        definitions[Language.EN] = {
          meaning: termEN.definition,
          examples: termEN.examples ? termEN.examples.split('\n').filter(Boolean) : [],
          synonyms: termEN.synonyms ? termEN.synonyms.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
      }

      const result: TermResult = {
        word: loadedTerm.title,
        translations,
        definitions,
        etymology: undefined,
      };
      
      setTermResult(result);
    } catch (error) {
      console.error('Error loading term:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const favorites = await dictionaryService.getFavorites();
      setIsFavorite(favorites.some((f) => f.term_id === termId));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = '/#login';
      return;
    }

    try {
      if (isFavorite) {
        await dictionaryService.removeFavorite(termId);
      } else {
        await dictionaryService.addFavorite(termId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!term || !termResult) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-slate-600 text-lg">{t('terms.notFound') as string}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => (window.location.href = '/#home')}
          className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors font-bold"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('home.backToExplore') as string}
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLang(Language.KK)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                lang === Language.KK ? 'bg-slate-900 text-white' : 'bg-white/60 hover:bg-white'
              }`}
            >
              Қаз
            </button>
            <button
              onClick={() => setLang(Language.RU)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                lang === Language.RU ? 'bg-slate-900 text-white' : 'bg-white/60 hover:bg-white'
              }`}
            >
              Рус
            </button>
            <button
              onClick={() => setLang(Language.EN)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                lang === Language.EN ? 'bg-slate-900 text-white' : 'bg-white/60 hover:bg-white'
              }`}
            >
              Eng
            </button>
          </div>
          {isAuthenticated && (
            <Button
              variant={isFavorite ? 'danger' : 'primary'}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? (t('terms.removeFromFavorites') as string) : (t('terms.addToFavorites') as string)}
            </Button>
          )}
        </div>
      </div>

      <ResultCard result={termResult} targetLang={lang} />
    </div>
  );
};
