import { AdminTermResult } from '../types/admin';

const STORAGE_KEY = 'poly_repo_terms';

export const termRepositoryService = {
  getAll: (): AdminTermResult[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Ошибка при загрузке терминов:', error);
    }
    return [];
  },

  save: (terms: AdminTermResult[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
    } catch (error) {
      console.error('Ошибка при сохранении терминов:', error);
      throw new Error('Не удалось сохранить термины');
    }
  },

  create: (term: AdminTermResult): AdminTermResult => {
    const terms = termRepositoryService.getAll();
    const newTerm: AdminTermResult = {
      ...term,
      id: Date.now(),
      lastUpdated: Date.now(),
    };
    termRepositoryService.save([newTerm, ...terms]);
    return newTerm;
  },

  update: (id: number | string, term: AdminTermResult): AdminTermResult | null => {
    const terms = termRepositoryService.getAll();
    const index = terms.findIndex((t) => t.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedTerm: AdminTermResult = {
      ...term,
      id,
      lastUpdated: Date.now(),
    };

    terms[index] = updatedTerm;
    termRepositoryService.save(terms);
    return updatedTerm;
  },

  delete: (id: number | string): boolean => {
    const terms = termRepositoryService.getAll();
    const filtered = terms.filter((t) => t.id !== id);
    
    if (filtered.length === terms.length) {
      return false;
    }

    termRepositoryService.save(filtered);
    return true;
  },

  search: (query: string): AdminTermResult[] => {
    const terms = termRepositoryService.getAll();
    const lowerQuery = query.toLowerCase();
    
    return terms.filter(
      (term) =>
        term.word.toLowerCase().includes(lowerQuery) ||
        term.translations.kk?.toLowerCase().includes(lowerQuery) ||
        term.translations.ru?.toLowerCase().includes(lowerQuery) ||
        term.translations.en?.toLowerCase().includes(lowerQuery)
    );
  },
};

