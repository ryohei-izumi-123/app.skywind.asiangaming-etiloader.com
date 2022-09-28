import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import * as moment from 'moment';
import { Observable, EMPTY as EMPTY$, from as fromPromise } from 'rxjs';
import * as _ from 'lodash';
export const LOG_BG_BLACK = 'background-color: black;';
export const LOG_COLOR_BLACK = 'color: black;';
export const LOG_BG_WHITE = 'background-color: white;';
export const LOG_COLOR_WHITE = 'color: white;';
export const LOG_BG_RED = 'background-color: red;';
export const LOG_COLOR_RED = 'color: red;';
export const LOG_BG_GREEN = 'background-color: green;';
export const LOG_COLOR_GREEN = 'color: green;';
export const LOG_BG_BLUE = 'background-color: blue;';
export const LOG_COLOR_BLUE = 'color: blue;';
export const LOG_BG_YELLOW = 'background-color: yellow;';
export const LOG_COLOR_YELLOW = 'color: yellow;';
export const LOG_BOLD = 'font-weight: bold;';
export const LOG_LARGE = 'font-size: xx-large;';
export const LOG_SMALL = 'font-size: xx-small;';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseLogger
 */
export abstract class BaseLogger {
  public info: any;
  public warn: any;
  public error: any;
}

/**
 *
 */
type TLogLevel = keyof BaseLogger;

/**
 *
 *
 * @export
 * @class LoggerService
 * @implements {BaseLogger}
 */
@Injectable({
  providedIn: 'root'
})
export class BaseLoggerService implements BaseLogger {
  public info: any;
  public warn: any;
  public error: any;
  public log(type: string, args?: any): void {}
}

/**
 *
 *
 * @export
 * @class LoggerService
 * @implements {BaseLogger}
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService implements BaseLogger {
  /**
   * Creates an instance of LoggerService.
   *
   * @memberOf LoggerService
   */
  public constructor() {}
  /**
   *
   *
   * @readonly
   * @memberof ConsoleLoggerService
   */
  public get info(): any {
    if (environment.debugLog) {
      return console.info.bind(console);
    }
    return window.noop();
  }

  /**
   *
   *
   * @readonly
   * @memberof ConsoleLoggerService
   */
  public get warn(): any {
    if (environment.debugLog) {
      return console.warn.bind(console);
    }
    return window.noop();
  }

  /**
   *
   *
   * @readonly
   * @memberof ConsoleLoggerService
   */
  public get error(): any {
    if (environment.debugLog) {
      return console.error.bind(console);
    }
    return window.noop();
  }

  /**
   *
   *
   * @param {TLogLevel} type
   * @returns
   * @memberof LoggerService
   */
  public getStyle(type: TLogLevel): string {
    return `${this.getBgStyle(type)}${this.getFontStyle(type)}${LOG_BOLD}`;
  }

  /**
   *
   *
   * @param {string} type
   * @returns {string}
   * @memberof LoggerService
   */
  public getIcon(type: string): string {
    let style: string = '';
    switch (type) {
      case 'error':
        style = `⛔️`;
        break;

      case 'info':
        style = `ℹ️`;
        break;

      case 'warn':
        style = `⚠️`;
        break;

      default:
        break;
    }
    return style;
  }

  /**
   *
   *
   * @param {string} type
   * @returns {string}
   * @memberof LoggerService
   */
  public getFontStyle(type: string): string {
    let style: string = '';
    switch (type) {
      case 'error':
        style = LOG_COLOR_WHITE;
        break;

      case 'info':
        style = LOG_COLOR_WHITE;
        break;

      case 'warn':
        style = LOG_COLOR_BLACK;
        break;

      default:
        break;
    }

    return style;
  }

  /**
   *
   *
   * @param {string} type
   * @returns {string}
   * @memberof LoggerService
   */
  public getBgStyle(type: string): string {
    let style: string = '';
    switch (type) {
      case 'error':
        style = LOG_BG_RED;
        break;

      case 'info':
        style = LOG_BG_BLUE;
        break;

      case 'warn':
        style = LOG_BG_YELLOW;
        break;

      default:
        break;
    }

    return style;
  }

  /**
   *
   *
   * @param {TLogLevel} type
   * @param {...any[]} args
   * @returns {*}
   * @memberof LoggerService
   */
  public log(type: TLogLevel, ...args: any[]): any {
    const logger: Function = console[type] || console.log || window.noop;
    const style: string = `%c`;
    if (args && args.length) {
      args.unshift(
        `[${moment()
          .clone()
          .toISOString()}]`
      );
      args.unshift(this.getStyle(type));
      args.unshift(`${style}${this.getIcon(type)}${type.toUpperCase()}:`);
    }

    logger.apply(console, args);
  }

  /**
   *
   *
   * @param {Error} error
   * @returns {Observable<string>}
   * @memberof LoggerService
   */
  public trace(error: Error): Observable<string> {
    if (_.isError(error)) {
      return fromPromise(
        StackTrace.fromError(error)
          .then((stackframes: StackTrace.StackFrame[]) =>
            stackframes
              .splice(0, 20)
              .map((sf: StackTrace.StackFrame) => sf.toString())
              .join('\n')
          )
          .catch((err: Error) => err.message)
      );
    }
    return EMPTY$;
  }
}
