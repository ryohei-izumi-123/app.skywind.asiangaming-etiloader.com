import { IPaginate } from './paginate';

/**
 *
 *
 * @export
 * @interface IPageable
 */
export interface IPageable<T> {
  result: T[];
  paginate: IPaginate;
}
