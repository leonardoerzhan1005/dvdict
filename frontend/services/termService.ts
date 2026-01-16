import { FREQUENT_TERMS, CATEGORIES } from '../constants';

export type SortOption = 'usage' | 'alpha';
export type Category = typeof CATEGORIES[number];

export interface TermFilterOptions {
  category: Category;
  sortBy: SortOption;
}

export const filterAndSortTerms = (options: TermFilterOptions) => {
  const { category, sortBy } = options;
  
  let filtered = category === 'All' 
    ? [...FREQUENT_TERMS] 
    : FREQUENT_TERMS.filter((term) => term.tag === category);

  if (sortBy === 'usage') {
    filtered.sort((a, b) => b.usageCount - a.usageCount);
  } else {
    filtered.sort((a, b) => a.word.localeCompare(b.word));
  }

  return filtered;
};

