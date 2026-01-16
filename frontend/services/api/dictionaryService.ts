import { API_CONFIG } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './base';
import { Language } from '../../types';

export type Lang = 'kz' | 'ru' | 'en';

const langMap: Record<Language, Lang> = {
  [Language.KK]: 'kz',
  [Language.RU]: 'ru',
  [Language.EN]: 'en',
};

export interface CategoryTranslation {
  language: Lang;
  title: string;
  description?: string;
}

export interface Category {
  id: number;
  slug: string;
  parent_id: number | null;
  title: string;
  description: string | null;
}

export interface CategoryCreateRequest {
  slug: string;
  parent_id?: number | null;
  translations: CategoryTranslation[];
}

export interface TermTranslation {
  language: Lang;
  title: string;
  definition: string;
  short_definition?: string;
  examples?: string;
  synonyms?: string;
  antonyms?: string;
}

export interface Term {
  id: number;
  slug: string;
  category_id: number;
  status: string;
  views: number;
  created_at: string;
  updated_at: string;
  language: Lang;
  title: string;
  definition: string;
  short_definition?: string;
  examples?: string;
  synonyms?: string;
  antonyms?: string;
  tags: Array<{ id: number; slug: string }>;
}

export interface TermCreateRequest {
  slug: string;
  category_id: number;
  translations: TermTranslation[];
  tag_slugs?: string[];
}

export interface TermUpdateRequest {
  slug?: string;
  category_id?: number;
  translations?: TermTranslation[];
  tag_slugs?: string[];
}

export interface Favorite {
  term_id: number;
  created_at: string;
}

export const dictionaryService = {
  getCategories: async (lang: Language = Language.RU): Promise<Category[]> => {
    return apiGet<Category[]>(
      API_CONFIG.getDictionaryUrl(`/categories?lang=${langMap[lang]}`),
      false
    );
  },

  getCategory: async (id: number, lang: Language = Language.RU): Promise<Category> => {
    return apiGet<Category>(
      API_CONFIG.getDictionaryUrl(`/categories/${id}?lang=${langMap[lang]}`),
      false
    );
  },

  createCategory: async (data: CategoryCreateRequest): Promise<Category> => {
    return apiPost<Category>(API_CONFIG.getDictionaryUrl('/categories'), data);
  },

  updateCategory: async (
    id: number,
    data: Partial<CategoryCreateRequest>,
    lang: Language = Language.RU
  ): Promise<Category> => {
    return apiPut<Category>(
      API_CONFIG.getDictionaryUrl(`/categories/${id}?lang=${langMap[lang]}`),
      data
    );
  },

  deleteCategory: async (id: number): Promise<void> => {
    return apiDelete(API_CONFIG.getDictionaryUrl(`/categories/${id}`));
  },

  getTerms: async (
    lang: Language = Language.RU,
    params?: {
      category_id?: number;
      letter?: string;
      status?: string;
      page?: number;
      size?: number;
    }
  ): Promise<Term[]> => {
    const queryParams = new URLSearchParams({
      lang: langMap[lang],
      ...(params?.category_id && { category_id: params.category_id.toString() }),
      ...(params?.letter && { letter: params.letter }),
      ...(params?.status && { status: params.status }),
      ...(params?.page && { page: params.page.toString() }),
      ...(params?.size && { size: params.size.toString() }),
    });

    return apiGet<Term[]>(API_CONFIG.getDictionaryUrl(`/terms?${queryParams}`));
  },

  getTerm: async (id: number, lang: Language = Language.RU): Promise<Term> => {
    return apiGet<Term>(
      API_CONFIG.getDictionaryUrl(`/terms/${id}?lang=${langMap[lang]}`),
      false
    );
  },

  createTerm: async (data: TermCreateRequest): Promise<Term> => {
    return apiPost<Term>(API_CONFIG.getDictionaryUrl('/terms'), data);
  },

  updateTerm: async (
    id: number,
    data: TermUpdateRequest,
    lang: Language = Language.RU
  ): Promise<Term> => {
    return apiPut<Term>(
      API_CONFIG.getDictionaryUrl(`/terms/${id}?lang=${langMap[lang]}`),
      data
    );
  },

  deleteTerm: async (id: number): Promise<void> => {
    return apiDelete(API_CONFIG.getDictionaryUrl(`/terms/${id}`));
  },

  submitTerm: async (id: number): Promise<Term> => {
    return apiPost<Term>(API_CONFIG.getDictionaryUrl(`/terms/${id}/submit`));
  },

  approveTerm: async (id: number): Promise<void> => {
    return apiPost(API_CONFIG.getDictionaryUrl(`/terms/${id}/approve`));
  },

  rejectTerm: async (id: number, reason: string): Promise<void> => {
    return apiPost(API_CONFIG.getDictionaryUrl(`/terms/${id}/reject`), { reason });
  },

  addFavorite: async (termId: number): Promise<void> => {
    return apiPost(API_CONFIG.getDictionaryUrl(`/favorites/${termId}`));
  },

  removeFavorite: async (termId: number): Promise<void> => {
    return apiDelete(API_CONFIG.getDictionaryUrl(`/favorites/${termId}`));
  },

  getFavorites: async (): Promise<Favorite[]> => {
    return apiGet<Favorite[]>(API_CONFIG.getDictionaryUrl('/favorites'));
  },

  createSuggestion: async (data: {
    term_text: string;
    definition?: string;
    language: Lang;
    category_id?: number;
  }): Promise<void> => {
    return apiPost(API_CONFIG.getDictionaryUrl('/suggestions'), data);
  },
};
