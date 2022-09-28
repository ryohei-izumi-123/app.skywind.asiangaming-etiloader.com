/**
 *
 *
 * @export
 * @interface IPaginate
 */
export interface IPaginate {
  filter?: string;
  count?: number;
  page?: number;
  pages?: number;
  limit?: number;
  sort?: string;
  direction?: 'desc' | 'asc' | '';
  offset?: number;
}
