import { TStatus } from '@shared/type';
import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface IFile
 */
export interface IFile {
  id?: number;
  name: string;
  path: string;
  directory: string;
  savedTo: string;
  extension: string;
  size: number;
  mimeType?: string;
  status?: TStatus;
  createdAt?: MomentInput;
  updatedAt?: MomentInput;
}
