import { TStatus, TIso6391 } from '@shared/type';
import { ICountry } from '@shared/interface/country';
import { MomentInput } from 'moment';
export interface ILanguage {
  id?: number;
  country: ICountry;
  countryId: number;
  iso6391: TIso6391;
  name: string;
  status?: TStatus;
  createdAt?: MomentInput;
  updatedAt?: MomentInput;
}
