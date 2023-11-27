export interface Paginated<T> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  result: T;
}
