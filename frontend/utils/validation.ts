export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length > 0;
};

export const validateApiKey = (apiKey: string | undefined): void => {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API ключ не настроен. Пожалуйста, установите GEMINI_API_KEY в переменных окружения.');
  }
};

