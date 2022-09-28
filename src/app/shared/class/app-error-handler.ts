import { environment } from '@env/environment';
import {
  Injectable,
  Injector,
  Inject,
  ErrorHandler,
  NgZone
} from '@angular/core';
import { from as fromPromise, of as of$, EMPTY as EMPTY$ } from 'rxjs';
import { catchError, take, tap, finalize } from 'rxjs/operators';
import { PathLocationStrategy } from '@angular/common';
import { ApiService } from '@shared/service/api.service';
import { LoggerService } from '@shared/service/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as moment from 'moment';
import * as Sentry from '@sentry/browser';
import * as Raven from 'raven-js';

/**
 *
 *
 * @export
 * @class AppErrorHandler
 * @extends {ErrorHandler}
 */
@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  /**
   *Creates an instance of AppErrorHandler.
   * @param {LoggerService} _loggerSvc
   * @param {Injector} _injector
   * @param {NgZone} _ngZone
   * @memberof AppErrorHandler
   */
  public constructor(
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    private _injector: Injector,
    private _ngZone: NgZone
  ) {
    this._ngZone.runOutsideAngular(() => this.init());
  }

  /**
   *
   *
   * @private
   * @memberof AppErrorHandler
   */
  private init(): void {
    try {
      if (environment.sentry.enabled) {
        if (environment.sentry.useRaven) {
          Raven.config(environment.sentry.dsn).install();
        } else {
          Sentry.init({
            dsn: environment.sentry.dsn,
            debug: environment.sentry.debug
          });
        }
      }
    } catch (warning) {
      this._loggerSvc.log('warn', warning);
    }
  }

  /**
   * capture via sentry
   *
   * @private
   * @param {*} originalError
   * @returns {boolean}
   * @memberof AppErrorHandler
   */
  private reportViaSentry(originalError: any): any {
    try {
      if (environment.sentry.enabled) {
        if (environment.sentry.useRaven) {
          Raven.captureException(originalError);
        } else {
          Sentry.captureException(originalError);
        }
      }
    } catch (warning) {
      this._loggerSvc.log('warn', warning);
    }
  }

  /**
   *
   *
   * @param {*} originalError
   * @returns {*}
   * @memberof AppErrorHandler
   */
  public handleError(originalError: any): any {
    const error: any = originalError.originalError || originalError;
    this._ngZone.runOutsideAngular(() =>
      fromPromise(StackTrace.fromError(error))
        .pipe(
          tap((stackframes: StackTrace.StackFrame[]) => {
            this.reportViaSentry(originalError);
            const _apiSvc: ApiService = this._injector.get(ApiService);
            const stackTrace: string = stackframes
              .splice(0, 20)
              .map((sf: StackTrace.StackFrame) => sf.toString())
              .join('\n');
            const errorMessage: string = error.message || error.toString();
            const url: string =
              location instanceof PathLocationStrategy
                ? location.path()
                : window.location.href;
            const date: string = moment()
              .clone()
              .toISOString();
            const payload: {
              err: {
                [key: string]: any;
              };
            } = {
              err: {
                stackTrace,
                url,
                errorMessage,
                date
              }
            };
            this._ngZone.run(() =>
              _apiSvc
                .post<any>(`${environment.api.endpoint.api}/error/app`, payload)
                .pipe(catchError(() => EMPTY$))
            );
          }),
          finalize(() =>
            this._loggerSvc.log(
              'error',
              `ERROR HANDLED AND ERROR REPORTING`,
              originalError
            )
          ),
          catchError((uncaughtError: Error) => {
            this._loggerSvc.log('error', uncaughtError);
            return of$(originalError);
          }),
          take(1)
        )
        .subscribe()
    );

    throw originalError;
  }
}
