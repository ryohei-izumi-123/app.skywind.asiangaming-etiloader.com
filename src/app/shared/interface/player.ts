import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface IPlayer
 */
export interface IPlayer {
  id: number;
  env?: 'staging' | 'production';
  entity?: string;
  playerCode: string;
  password?: string;
  confirmPassword?: string;
  balance?: number;
  gameGroup?: string;
  status?: 'active' | 'inactive' | 'pending';
  createdId?: number;
  createdAt?: MomentInput;
  updatedId?: number;
  updatedAt?: MomentInput;
  deletedId?: number;
  deletedAt?: MomentInput;
}
