import { TStatus, TIso3166A2, TIso3166A3, TCallPrefix } from '@shared/type';
import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface ICountry
 */
export interface ICountry {
  id?: number;
  name: string;
  iso3166A2: TIso3166A2;
  iso3166A3: TIso3166A3;
  callPrefix: TCallPrefix;
  status?: TStatus;
  createdAt?: MomentInput;
  updatedAt?: MomentInput;
}
