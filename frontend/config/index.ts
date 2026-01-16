/**
 * Конфигурация приложения
 * 
 * USE_MOCK_DATA: true - использовать mock данные вместо реального backend API
 * USE_MOCK_DATA: false - использовать реальный backend API (требует запущенные сервисы на портах 8001-8005)
 * 
 * API_DELAY_MS: задержка в миллисекундах для имитации сетевого запроса при использовании mock данных
 */
export const CONFIG = {
  USE_MOCK_DATA: false,
  API_DELAY_MS: 800,
} as const;

