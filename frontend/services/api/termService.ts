import { searchService, SearchHit } from './searchService';
import { dictionaryService, Term } from './dictionaryService';
import { Language, TermResult, Definition } from '../../types';

const convertSearchHitToTermResult = async (
  hit: SearchHit,
  from: Language,
  to: Language
): Promise<TermResult> => {
  try {
    const term = await dictionaryService.getTerm(hit.term_id, to);
    
    const translations: Record<Language, string> = {
      [Language.KK]: term.language === 'kz' ? term.title : '',
      [Language.RU]: term.language === 'ru' ? term.title : '',
      [Language.EN]: term.language === 'en' ? term.title : '',
    };

    const definitions: Record<Language, Definition> = {
      [Language.KK]: {
        meaning: term.definition,
        examples: term.examples ? term.examples.split('\n').filter(Boolean) : [],
        synonyms: term.synonyms ? term.synonyms.split(',').map(s => s.trim()) : [],
      },
      [Language.RU]: {
        meaning: term.definition,
        examples: term.examples ? term.examples.split('\n').filter(Boolean) : [],
        synonyms: term.synonyms ? term.synonyms.split(',').map(s => s.trim()) : [],
      },
      [Language.EN]: {
        meaning: term.definition,
        examples: term.examples ? term.examples.split('\n').filter(Boolean) : [],
        synonyms: term.synonyms ? term.synonyms.split(',').map(s => s.trim()) : [],
      },
    };

    return {
      word: term.title,
      translations,
      definitions,
    };
  } catch (error) {
    throw new Error('Термин не найден');
  }
};

export const fetchTermDetails = async (
  word: string,
  from: Language,
  to: Language
): Promise<TermResult> => {
  const searchResults = await searchService.search({
    q: word,
    lang: to,
    size: 1,
  });

  if (searchResults.items.length === 0) {
    throw new Error('Термин не найден');
  }

  return convertSearchHitToTermResult(searchResults.items[0], from, to);
};
