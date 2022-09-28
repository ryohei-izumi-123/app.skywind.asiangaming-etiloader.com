import { TStatus, TIso4217 } from '@shared/type';
import { ICountry } from '@shared/interface/country';
import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface ICurrency
 */
export interface ICurrency {
  id?: number;
  countryId: number;
  country: ICountry;
  name: string;
  iso4217: TIso4217;
  baseRate: number;
  status?: TStatus;
  createdAt?: MomentInput;
  updatedAt?: MomentInput;
}
