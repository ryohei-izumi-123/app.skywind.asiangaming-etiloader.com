import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface ILogin
 */
export interface ILogin {
  accessToken: string;
  refreshToken: string;
  expiredAt: MomentInput;
}

/**
 *
 *
 * @export
 * @interface ILoginParam
 */
export interface ILoginParam {
  playerCode: string;
  password?: string;
  remember?: boolean;
}
