import { InjectionToken } from '@angular/core';

/**
 *
 * @param token
 */
export const toTokenize = token =>
  `${token}`.trim().replace('InjectionToken', '');

/**
 *  @description jwt token key
 */
export const APP_AUTH_TOKEN: InjectionToken<string> = new InjectionToken<
  string
>('APP_AUTH_TOKEN');

/**
 *
 */
export const APP_LOGIN_CREDENTIALS: InjectionToken<string> = new InjectionToken<
  string
>('APP_LOGIN_CREDENTIALS');

/**
 *
 */
export const APP_LANGUAGE_TOKEN: InjectionToken<string> = new InjectionToken<
  string
>('APP_LANGUAGE_TOKEN');

/**
 *
 */
export const APP_CURRENCY_TOKEN: InjectionToken<string> = new InjectionToken<
  string
>('APP_CURRENCY_TOKEN');

/**
 *
 */
export const APP_SOUND_TOKEN: InjectionToken<string> = new InjectionToken<
  string
>('APP_SOUND_TOKEN');
