import { API_CONFIG } from '../../config/api';
import { apiGet } from './base';
import { dictionaryService, Term, TermCreateRequest, TermUpdateRequest, TermTranslation, Category } from './dictionaryService';
import { AdminTermResult } from '../../types/admin';
import { Language } from '../../types';

const langMap: Record<Language, 'kz' | 'ru' | 'en'> = {
  [Language.KK]: 'kz',
  [Language.RU]: 'ru',
  [Language.EN]: 'en',
};

// Получаем полный термин со всеми переводами
const getTermFull = async (id: number): Promise<AdminTermResult | null> => {
  try {
    // Загружаем термин для каждого языка, чтобы получить все переводы
    const [termRu, termKz, termEn] = await Promise.all([
      dictionaryService.getTerm(id, Language.RU).catch(() => null),
      dictionaryService.getTerm(id, Language.KK).catch(() => null),
      dictionaryService.getTerm(id, Language.EN).catch(() => null),
    ]);

    const primaryTerm = termRu || termKz || termEn;
    if (!primaryTerm) return null;

    return {
      id: primaryTerm.id,
      word: primaryTerm.title,
      translations: {
        ru: termRu?.title || '',
        kk: termKz?.title || '',
        en: termEn?.title || '',
      },
      category: '', // Будет заполнено из category_id
      status: primaryTerm.status === 'approved' ? 'Verified' : primaryTerm.status === 'pending' ? 'Pending' : 'Draft',
      lastUpdated: new Date(primaryTerm.updated_at).getTime(),
      views: primaryTerm.views,
      definitions: {
        ru: {
          meaning: termRu?.definition || '',
          description: termRu?.short_definition || '',
          examples: termRu?.examples ? termRu.examples.split(',').map(e => e.trim()) : [],
          synonyms: termRu?.synonyms ? termRu.synonyms.split(',').map(s => s.trim()) : [],
        },
        kk: {
          meaning: termKz?.definition || '',
          description: termKz?.short_definition || '',
          examples: termKz?.examples ? termKz.examples.split(',').map(e => e.trim()) : [],
          synonyms: termKz?.synonyms ? termKz.synonyms.split(',').map(s => s.trim()) : [],
        },
        en: {
          meaning: termEn?.definition || '',
          description: termEn?.short_definition || '',
          examples: termEn?.examples ? termEn.examples.split(',').map(e => e.trim()) : [],
          synonyms: termEn?.synonyms ? termEn.synonyms.split(',').map(s => s.trim()) : [],
        },
      },
      tags: primaryTerm.tags.map(tag => tag.slug),
      category_id: primaryTerm.category_id,
    } as AdminTermResult;
  } catch (error) {
    console.error('Error fetching full term:', error);
    return null;
  }
};

// Загружает полный термин со всеми переводами
const loadFullTerm = async (termId: number): Promise<AdminTermResult | null> => {
  try {
    // Загружаем термин для всех языков, чтобы получить все переводы
    const [termRu, termKz, termEn] = await Promise.all([
      dictionaryService.getTerm(termId, Language.RU).catch(() => null),
      dictionaryService.getTerm(termId, Language.KK).catch(() => null),
      dictionaryService.getTerm(termId, Language.EN).catch(() => null),
    ]);

    const primaryTerm = termRu || termKz || termEn;
    if (!primaryTerm) return null;

    return {
      id: primaryTerm.id,
      word: termRu?.title || termKz?.title || termEn?.title || '',
      translations: {
        ru: termRu?.title || '',
        kk: termKz?.title || '',
        en: termEn?.title || '',
      },
      category: '',
      status: primaryTerm.status === 'approved' ? 'Verified' : primaryTerm.status === 'pending' ? 'Pending' : 'Draft',
      lastUpdated: new Date(primaryTerm.updated_at).getTime(),
      views: primaryTerm.views,
      category_id: primaryTerm.category_id,
      definitions: {
        ru: {
          meaning: termRu?.definition || '',
          examples: [],
          synonyms: [],
        },
        kk: {
          meaning: termKz?.definition || '',
          examples: [],
          synonyms: [],
        },
        en: {
          meaning: termEn?.definition || '',
          examples: [],
          synonyms: [],
        },
      },
      tags: primaryTerm.tags.map(tag => tag.slug),
    } as AdminTermResult;
  } catch (error) {
    console.error('Error loading full term:', error);
    return null;
  }
};

const convertTermToAdminTerm = (term: Term): AdminTermResult => {
  return {
    id: term.id,
    word: term.title,
    translations: {
      kk: term.language === 'kz' ? term.title : '',
      ru: term.language === 'ru' ? term.title : '',
      en: term.language === 'en' ? term.title : '',
    },
    category: '',
    status: term.status === 'approved' ? 'Verified' : term.status === 'pending' ? 'Pending' : 'Draft',
    lastUpdated: new Date(term.updated_at).getTime(),
    views: term.views,
    category_id: term.category_id,
  } as AdminTermResult;
};

export const adminService = {
  getTerms: async (page?: number, size?: number): Promise<AdminTermResult[]> => {
    try {
      // Сначала получаем список ID всех терминов
      let termIds: number[] = [];
      
      if (page === undefined && size === undefined) {
        // Загружаем все термины постранично для получения ID
        let currentPage = 1;
        const pageSize = 100;
        let hasMore = true;

        while (hasMore) {
          const terms = await dictionaryService.getTerms(Language.RU, { page: currentPage, size: pageSize });
          if (terms.length === 0) {
            hasMore = false;
          } else {
            termIds.push(...terms.map(t => t.id));
            if (terms.length < pageSize) {
              hasMore = false;
            } else {
              currentPage++;
            }
          }
        }
      } else {
        // Загружаем термины с пагинацией
        const terms = await dictionaryService.getTerms(Language.RU, { page, size });
        termIds = terms.map(t => t.id);
      }

      // Загружаем полные данные терминов для всех языков
      // Ограничиваем количество параллельных запросов, чтобы не перегружать API
      const batchSize = 10;
      const allTerms: AdminTermResult[] = [];
      
      for (let i = 0; i < termIds.length; i += batchSize) {
        const batch = termIds.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(id => loadFullTerm(id))
        );
        allTerms.push(...batchResults.filter((t): t is AdminTermResult => t !== null));
      }

      return allTerms;
    } catch (error) {
      console.error('Error fetching terms:', error);
      return [];
    }
  },

  getTerm: async (id: number): Promise<AdminTermResult | null> => {
    return getTermFull(id);
  },

  getCategories: async (lang: Language = Language.RU): Promise<Category[]> => {
    try {
      const categories = await dictionaryService.getCategories(lang);
      return categories as any; // Category из API совместим с Category из types
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  createTerm: async (data: AdminTermResult): Promise<AdminTermResult> => {
    // Формируем переводы для всех языков
    const translations: TermTranslation[] = [];
    
    // Добавляем переводы только для заполненных языков
    if (data.translations.ru || data.definitions?.ru?.meaning) {
      translations.push({
        language: 'ru',
        title: data.translations.ru || data.word,
        definition: data.definitions?.ru?.meaning || data.translations.ru || data.word,
        short_definition: data.definitions?.ru?.description || undefined,
        examples: data.definitions?.ru?.examples?.length ? data.definitions.ru.examples.join(', ') : undefined,
        synonyms: data.definitions?.ru?.synonyms?.length ? data.definitions.ru.synonyms.join(', ') : undefined,
      });
    }
    
    if (data.translations.kk || data.definitions?.kk?.meaning) {
      translations.push({
        language: 'kz',
        title: data.translations.kk || data.word,
        definition: data.definitions?.kk?.meaning || data.translations.kk || data.word,
        short_definition: data.definitions?.kk?.description || undefined,
        examples: data.definitions?.kk?.examples?.length ? data.definitions.kk.examples.join(', ') : undefined,
        synonyms: data.definitions?.kk?.synonyms?.length ? data.definitions.kk.synonyms.join(', ') : undefined,
      });
    }
    
    if (data.translations.en || data.definitions?.en?.meaning) {
      translations.push({
        language: 'en',
        title: data.translations.en || data.word,
        definition: data.definitions?.en?.meaning || data.translations.en || data.word,
        short_definition: data.definitions?.en?.description || undefined,
        examples: data.definitions?.en?.examples?.length ? data.definitions.en.examples.join(', ') : undefined,
        synonyms: data.definitions?.en?.synonyms?.length ? data.definitions.en.synonyms.join(', ') : undefined,
      });
    }

    if (translations.length === 0) {
      throw new Error('Необходимо заполнить хотя бы один перевод');
    }

    const createData: TermCreateRequest = {
      slug: data.word.toLowerCase().replace(/[^a-z0-9а-яё-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      category_id: (data as any).category_id || 1, // Используем category_id если есть
      translations,
      tag_slugs: data.tags || [],
    };

    const term = await dictionaryService.createTerm(createData);
    let result = await getTermFull(term.id) || convertTermToAdminTerm(term);
    
    // Управление статусом после создания:
    // - Если выбран Verified, но термин создан как draft/pending - одобряем
    // - Если выбран Pending, но термин создан как draft - отправляем на модерацию
    // - Если выбран Draft - оставляем как есть
    if (data.status === 'Verified' && result && result.status !== 'Verified') {
      // Если термин не в статусе Verified, нужно сначала отправить на модерацию, потом одобрить
      if (result.status === 'Draft') {
        try {
          await dictionaryService.submitTerm(term.id);
          result = await getTermFull(term.id) || result;
        } catch (err) {
          console.warn('Could not submit term:', err);
        }
      }
      // Теперь одобряем, если термин в статусе Pending
      if (result.status === 'Pending') {
        try {
          await dictionaryService.approveTerm(term.id);
          result = await getTermFull(term.id) || result;
        } catch (err) {
          console.warn('Could not approve term:', err);
        }
      }
    } else if (data.status === 'Pending' && result && result.status === 'Draft') {
      try {
        await dictionaryService.submitTerm(term.id);
        result = await getTermFull(term.id) || result;
      } catch (err) {
        console.warn('Could not submit term for moderation:', err);
      }
    }
    // Если статус Draft - ничего не делаем, оставляем как есть
    
    return result;
  },

  updateTerm: async (id: number, data: AdminTermResult): Promise<AdminTermResult> => {
    // Формируем переводы для всех языков
    // ВАЖНО: отправляем ВСЕ переводы, даже если они пустые, чтобы обновить существующие
    const translations: TermTranslation[] = [];
    
    // Всегда добавляем все три языка, чтобы обновить существующие переводы
    // Если перевод не заполнен, используем пустую строку или существующее значение
    translations.push({
      language: 'ru',
      title: data.translations?.ru || data.word || '',
      definition: data.definitions?.ru?.meaning || data.translations?.ru || data.word || '',
      short_definition: data.definitions?.ru?.description || undefined,
      examples: data.definitions?.ru?.examples?.length ? data.definitions.ru.examples.join(', ') : undefined,
      synonyms: data.definitions?.ru?.synonyms?.length ? data.definitions.ru.synonyms.join(', ') : undefined,
    });
    
    translations.push({
      language: 'kz',
      title: data.translations?.kk || data.word || '',
      definition: data.definitions?.kk?.meaning || data.translations?.kk || data.word || '',
      short_definition: data.definitions?.kk?.description || undefined,
      examples: data.definitions?.kk?.examples?.length ? data.definitions.kk.examples.join(', ') : undefined,
      synonyms: data.definitions?.kk?.synonyms?.length ? data.definitions.kk.synonyms.join(', ') : undefined,
    });
    
    translations.push({
      language: 'en',
      title: data.translations?.en || data.word || '',
      definition: data.definitions?.en?.meaning || data.translations?.en || data.word || '',
      short_definition: data.definitions?.en?.description || undefined,
      examples: data.definitions?.en?.examples?.length ? data.definitions.en.examples.join(', ') : undefined,
      synonyms: data.definitions?.en?.synonyms?.length ? data.definitions.en.synonyms.join(', ') : undefined,
    });

    const updateData: TermUpdateRequest = {
      slug: data.word.toLowerCase().replace(/[^a-z0-9а-яё-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      category_id: (data as any).category_id || undefined,
      translations: translations, // Всегда отправляем все переводы
      tag_slugs: data.tags || undefined,
    };

    console.log('Updating term:', id, updateData);
    const term = await dictionaryService.updateTerm(id, updateData, Language.RU);
    let updated = await getTermFull(term.id) || convertTermToAdminTerm(term);
    
    // Обновляем статус если он изменился
    if (data.status && data.status !== updated.status) {
      if (data.status === 'Verified') {
        // Для одобрения термин должен быть в статусе Pending
        if (updated.status === 'Draft') {
          try {
            await dictionaryService.submitTerm(id);
            updated = await getTermFull(id) || updated;
          } catch (err) {
            console.warn('Could not submit term:', err);
          }
        }
        if (updated.status === 'Pending') {
          try {
            await dictionaryService.approveTerm(id);
            updated = await getTermFull(id) || updated;
          } catch (err) {
            console.warn('Could not approve term:', err);
          }
        }
      } else if (data.status === 'Pending') {
        // Для отправки на модерацию термин должен быть в статусе Draft
        if (updated.status === 'Draft') {
          try {
            await dictionaryService.submitTerm(id);
            updated = await getTermFull(id) || updated;
          } catch (err) {
            console.warn('Could not submit term:', err);
          }
        }
      }
      // Если статус Draft - ничего не делаем (термин уже в draft или нужно отклонить/вернуть)
    }
    
    console.log('Term updated:', updated);
    return updated;
  },

  deleteTerm: async (id: number): Promise<void> => {
    await dictionaryService.deleteTerm(id);
  },
};
