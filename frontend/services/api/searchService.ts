import { API_CONFIG } from '../../config/api';
import { apiGet } from './base';
import { Language } from '../../types';

export type Lang = 'kz' | 'ru' | 'en';

const langMap: Record<Language, Lang> = {
  [Language.KK]: 'kz',
  [Language.RU]: 'ru',
  [Language.EN]: 'en',
};

export interface SearchHit {
  term_id: number;
  slug: string;
  title: string;
  short_definition?: string;
  definition?: string;
  category_id: number;
  rank: number;
  views?: number;
}

export interface AutocompleteHit {
  term_id: number;
  slug: string;
  title: string;
}

export interface SearchResponse {
  meta: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
  items: SearchHit[];
}

export interface SearchParams {
  q: string;
  lang?: Language;
  category_id?: number;
  letter?: string;
  status?: string;
  sort?: 'newest' | 'oldest' | 'popularity' | 'alphabetical';
  page?: number;
  size?: number;
}

export const searchService = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({
      q: params.q,
      lang: langMap[params.lang || Language.RU],
      ...(params.category_id && { category_id: params.category_id.toString() }),
      ...(params.letter && { letter: params.letter }),
      ...(params.status && { status: params.status }),
      ...(params.sort && { sort: params.sort }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.size && { size: params.size.toString() }),
    });

    return apiGet<SearchResponse>(
      API_CONFIG.getSearchUrl(`/search?${queryParams}`),
      false
    );
  },

  autocomplete: async (
    query: string,
    lang: Language = Language.RU,
    limit: number = 10
  ): Promise<AutocompleteHit[]> => {
    const queryParams = new URLSearchParams({
      q: query,
      lang: langMap[lang],
      limit: limit.toString(),
    });

    return apiGet<AutocompleteHit[]>(
      API_CONFIG.getSearchUrl(`/search/autocomplete?${queryParams}`),
      false
    );
  },
};
