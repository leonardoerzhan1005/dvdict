import { Language, TermResult, Definition } from '../types';
import { Category as ApiCategory } from '../services/api/dictionaryService';

export type Category = 'Technical' | 'Political' | 'Strategy' | 'Ecological';
export type TermStatus = 'Draft' | 'Pending' | 'Verified';

export interface AdminTermResult extends TermResult {
  id?: number | string;
  word: string;
  translations: {
    [key in Language]?: string;
  };
  category?: Category | string;
  category_id?: number;
  status?: TermStatus;
  morphology?: string;
  lastUpdated?: number;
  views?: number;
  tags?: string[];
  definitions: {
    [key in Language]?: AdminDefinition;
  };
}

// Экспортируем тип Category из API для использования в компонентах
export type { ApiCategory };

export interface AdminDefinition extends Definition {
  description?: string;
}

