import { environment } from '@env/environment';
import { Inject, Injector, Injectable, LOCALE_ID } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError as throwError$ } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { JwtService, FingerPrintService } from '@shared/service';
import { TIso6391 } from '@shared/type';

/**
 *
 *
 * @export
 * @class ApiInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {
  /**
   *Creates an instance of ApiInterceptor.
   * @param {Injector} _injector
   * @memberof ApiInterceptor
   */
  public constructor(
    @Inject(LOCALE_ID) private _localeId: TIso6391,
    private _injector: Injector
  ) {}

  /**
   *
   *
   * @private
   * @param {HttpResponse<any>} response
   * @returns
   * @memberof ApiInterceptor
   */
  private emptyResponseMapper(response: HttpResponse<any>) {
    return response;
  }

  /**
   *
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof ApiInterceptor
   */
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const _jwtSvc: JwtService = this._injector.get(JwtService);
    const _fingerPrintSvc: FingerPrintService = this._injector.get(
      FingerPrintService
    );
    const accessToken: string = _jwtSvc.get() || '';
    return _fingerPrintSvc.value$.pipe(
      map((fingerPrint: string) => {
        const isGoogle: boolean = _.toString(request.url).includes(
          environment.google.storage
        );
        if (isGoogle) {
          return request.clone({
            withCredentials: false
          });
        }

        return request.clone({
          withCredentials: true,
          setHeaders: {
            'User-Language': this._localeId,
            Authorization: `bearer ${accessToken}`,
            'X-AUTH-TOKEN': fingerPrint,
            'X-API-SCOPE': 'PLAYER'
          }
        });
      }),
      concatMap((clone: HttpRequest<any>) => next.handle(clone)),
      map((event: HttpEvent<any>) =>
        event instanceof HttpResponse ? this.emptyResponseMapper(event) : event
      ),
      catchError((error: HttpErrorResponse) => throwError$(error))
    );
  }
}
