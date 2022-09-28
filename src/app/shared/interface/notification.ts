import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface INotification
 */
export interface INotification {
  id: number;
  playerId: number;
  title: string;
  img?: string;
  content: string;
  status: 'active' | 'inactive' | 'pending';
  createdId: number;
  createdAt: MomentInput;
  updatedId: number;
  updatedAt: MomentInput;
  deletedId: number;
  deletedAt: MomentInput;
}
