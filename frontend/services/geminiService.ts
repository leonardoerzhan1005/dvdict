import { GoogleGenAI, Type } from '@google/genai';
import { Language, TermResult } from '../types';
import { validateApiKey } from '../utils/validation';
import { validateSearchQuery } from '../utils/validation';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

const createDictionarySchema = () => ({
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    pronunciation: { type: Type.STRING },
    translations: {
      type: Type.OBJECT,
      properties: {
        kk: { type: Type.STRING },
        ru: { type: Type.STRING },
        en: { type: Type.STRING },
      },
    },
    definitions: {
      type: Type.OBJECT,
      properties: {
        kk: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['meaning'],
        },
        ru: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['meaning'],
        },
        en: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['meaning'],
        },
      },
    },
    etymology: { type: Type.STRING },
  },
  required: ['word', 'translations', 'definitions'],
});

const createPrompt = (word: string, from: Language, to: Language): string => {
  return `Acting as a professional linguistic expert, provide a comprehensive dictionary entry for the term "${word}" originally in ${from} and targeted towards ${to}. Ensure you include translations for all three languages (Kazakh, Russian, English) and localized definitions.`;
};

const initializeAI = (): GoogleGenAI => {
  validateApiKey(API_KEY);
  return new GoogleGenAI({ apiKey: API_KEY! });
};

const parseResponse = (text: string): TermResult => {
  try {
    const parsed = JSON.parse(text.trim());
    
    if (!parsed.word || !parsed.translations || !parsed.definitions) {
      throw new Error('Неполный ответ от API: отсутствуют обязательные поля');
    }
    
    return parsed as TermResult;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Ошибка парсинга ответа от API. Попробуйте еще раз.');
    }
    throw error;
  }
};

export const fetchTermDetails = async (
  word: string,
  from: Language,
  to: Language
): Promise<TermResult> => {
  if (!validateSearchQuery(word)) {
    throw new Error('Поисковый запрос не может быть пустым');
  }

  try {
    const ai = initializeAI();
    const prompt = createPrompt(word, from, to);
    const schema = createDictionarySchema();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    if (!response.text) {
      throw new Error('Пустой ответ от API');
    }

    return parseResponse(response.text);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при получении данных: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при получении данных');
  }
};

