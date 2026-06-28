// Shape JSend del backend: { status, success, data }.
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  success: boolean;
  data: T;
  message?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}
