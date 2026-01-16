import { Language, TermResult } from '../types';
import { CONFIG } from '../config';
import { fetchTermDetailsMock } from './mockTermService';
import { fetchTermDetails as fetchTermDetailsBackend } from './api/termService';

export const fetchTermDetails = async (
  word: string,
  from: Language,
  to: Language
): Promise<TermResult> => {
  if (CONFIG.USE_MOCK_DATA) {
    return fetchTermDetailsMock(word, from, to);
  }
  
  try {
    return await fetchTermDetailsBackend(word, from, to);
  } catch (error) {
    console.error('Backend API error, falling back to mock:', error);
    return fetchTermDetailsMock(word, from, to);
  }
};

