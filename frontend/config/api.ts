// Определяем окружение: production использует относительные пути, dev - локальные порты
const isProduction = import.meta.env.MODE === 'production' || import.meta.env.PROD;

export const API_CONFIG = {
  // В продакшене используем относительные пути (один домен), в dev - локальные порты
  AUTH_SERVICE: isProduction ? '' : 'http://localhost:8001',
  DICTIONARY_SERVICE: isProduction ? '' : 'http://localhost:8002',
  SEARCH_SERVICE: isProduction ? '' : 'http://localhost:8003',
  IMPORT_EXPORT_SERVICE: isProduction ? '' : 'http://localhost:8004',
  ADMIN_SERVICE: isProduction ? '' : 'http://localhost:8005',
  
  API_VERSION: 'v1',
  
  getAuthUrl: (path: string) => `${API_CONFIG.AUTH_SERVICE}/api/${API_CONFIG.API_VERSION}${path}`,
  getDictionaryUrl: (path: string) => `${API_CONFIG.DICTIONARY_SERVICE}/api/${API_CONFIG.API_VERSION}${path}`,
  getSearchUrl: (path: string) => `${API_CONFIG.SEARCH_SERVICE}/api/${API_CONFIG.API_VERSION}${path}`,
  getImportExportUrl: (path: string) => `${API_CONFIG.IMPORT_EXPORT_SERVICE}/api/${API_CONFIG.API_VERSION}${path}`,
  getAdminUrl: (path: string) => `${API_CONFIG.ADMIN_SERVICE}/api/${API_CONFIG.API_VERSION}${path}`,
};
