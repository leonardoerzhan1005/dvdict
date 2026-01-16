
export enum Language {
  KK = 'kk',
  RU = 'ru',
  EN = 'en'
}

export interface Definition {
  meaning: string;
  examples: string[];
  synonyms: string[];
  context?: string;
}

export interface TermResult {
  word: string;
  pronunciation?: string;
  translations: {
    [key in Language]?: string;
  };
  definitions: {
    [key in Language]?: Definition;
  };
  etymology?: string;
}

export interface SearchState {
  query: string;
  from: Language;
  to: Language;
  loading: boolean;
  result: TermResult | null;
  error: string | null;
}
