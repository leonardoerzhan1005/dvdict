import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../../config/api';

export interface ApiError {
  error_code: string;
  message: string;
  details?: Record<string, any>;
}

export class ApiException extends Error {
  constructor(
    public error: ApiError,
    public status: number
  ) {
    super(error.message);
    this.name = 'ApiException';
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Редирект на страницу логина
 * Используется при ошибках авторизации или истечении токена
 */
export const redirectToLogin = (): void => {
  window.location.href = '/#login';
};

// Создаем базовый экземпляр axios
const axiosInstance: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Флаг для предотвращения бесконечного цикла при refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - добавляет токен авторизации
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Проверяем, нужно ли добавлять токен (по умолчанию true)
    const includeAuth = (config as any).includeAuth !== false;
    
    if (includeAuth) {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Удаляем заголовок Authorization, если авторизация не нужна
      if (config.headers) {
        delete config.headers.Authorization;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обрабатывает 401 и автоматически обновляет токен
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Если ошибка 401 и это не запрос на refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если уже идет refresh, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const response = await axiosInstance.post(
          API_CONFIG.getAuthUrl('/auth/refresh'),
          { refresh_token: refreshToken },
          { includeAuth: false } as AxiosRequestConfig & { includeAuth?: boolean }
        );

        const { tokens } = response.data;
        setAuthTokens(tokens.access_token, tokens.refresh_token);

        // Обновляем заголовок оригинального запроса
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        }

        processQueue(null, tokens.access_token);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        redirectToLogin();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // Обработка других ошибок
    let apiError: ApiError;
    if (error.response?.data) {
      const errorData = error.response.data as any;
      
      if (errorData.error_code) {
        apiError = {
          error_code: errorData.error_code,
          message: errorData.message || 'Произошла ошибка',
          details: errorData.details,
        };
      } else if (errorData.detail) {
        // FastAPI validation error format
        const detailMsg = Array.isArray(errorData.detail)
          ? errorData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ')
          : errorData.detail;
        apiError = {
          error_code: 'VALIDATION_ERROR',
          message: detailMsg,
          details: errorData.detail,
        };
      } else {
        apiError = {
          error_code: 'UNKNOWN_ERROR',
          message: errorData.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
          details: errorData,
        };
      }
    } else {
      apiError = {
        error_code: 'NETWORK_ERROR',
        message: error.message || 'Ошибка сети',
      };
    }

    throw new ApiException(apiError, error.response?.status || 0);
  }
);

export const apiRequest = async <T>(
  url: string,
  options: AxiosRequestConfig = {},
  includeAuth: boolean = true
): Promise<T> => {
  try {
    const config: AxiosRequestConfig & { includeAuth?: boolean } = {
      ...options,
      url,
      includeAuth, // Передаем флаг в config для использования в interceptor
    };

    const response = await axiosInstance.request<T>(config);

    // Для 204 No Content возвращаем пустой объект
    if (response.status === 204) {
      return {} as T;
    }

    return response.data;
  } catch (error) {
    // Ошибки уже обработаны в interceptor
    throw error;
  }
};

export const apiGet = <T>(url: string, includeAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(url, { method: 'GET' }, includeAuth);
};

export const apiPost = <T>(url: string, data?: any, includeAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(
    url,
    {
      method: 'POST',
      data,
    },
    includeAuth
  );
};

export const apiPut = <T>(url: string, data?: any, includeAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(
    url,
    {
      method: 'PUT',
      data,
    },
    includeAuth
  );
};

export const apiPatch = <T>(url: string, data?: any, includeAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(
    url,
    {
      method: 'PATCH',
      data,
    },
    includeAuth
  );
};

export const apiDelete = <T>(url: string, includeAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(url, { method: 'DELETE' }, includeAuth);
};
