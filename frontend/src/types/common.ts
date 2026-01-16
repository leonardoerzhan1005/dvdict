export interface PageMeta {
  page: number;
  size: number;
  total: number;
  pages: number;
}

export interface PageResponse<T> {
  meta: PageMeta;
  items: T[];
}

export interface ApiError {
  error_code: string;
  message: string;
  details?: Record<string, any>;
}
