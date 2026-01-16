export type Lang = 'kz' | 'ru' | 'en';

export interface Category {
  id: number;
  slug: string;
  parent_id: number | null;
  title: string;
  description: string | null;
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

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
}
