import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  throwError as throwError$,
  from as fromPromise,
  EMPTY as EMPTY$
} from 'rxjs';
import { concatMap, catchError, map, timeout, take } from 'rxjs/operators';
import * as _ from 'lodash';
import { LoggerService } from '@shared/service/logger.service';
import { UnauthorizedService } from '@shared/service/unauthorized.service';

/**
 *
 *
 * @export
 * @class ApiService
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {
  /**
   *Creates an instance of ApiService.
   * @param {UnauthorizedService} _unauthorizedSvc
   * @param {LoggerService} _loggerSvc
   * @param {Router} _router
   * @param {HttpClient} _http
   * @memberof ApiService
   */
  constructor(
    @Inject(UnauthorizedService) private _unauthorizedSvc: UnauthorizedService,
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    private _router: Router,
    private _http: HttpClient
  ) {}

  /**
   *
   *
   * @memberof ApiService
   */
  public ngOnDestroy() {}

  /**
   *
   *
   * @private
   * @param {string} url
   * @returns {string}
   * @memberof ApiService
   */
  private extractUrl(url: string): string {
    const isAbsolute: boolean =
      _.toLower(url).startsWith('//') ||
      _.toLower(url).startsWith('http://') ||
      _.toLower(url).startsWith('https://');
    if (isAbsolute) {
      return url;
    }

    return `${environment.api.url}${url}`;
  }

  /**
   *
   *
   * @private
   * @param {({ [name: string]: string | string[] })} [headersConfig={ 'Content-Type': 'application/json' }]
   * @returns {HttpHeaders}
   * @memberof ApiService
   */
  private setHeaders(
    headersConfig: { [name: string]: string | string[] } = {
      'Content-Type': 'application/json'
    }
  ): HttpHeaders {
    return new HttpHeaders(headersConfig);
  }

  /**
   *
   *
   * @private
   * @memberof ApiService
   */
  private formatErrors = (
    error: HttpErrorResponse | Error
  ): Observable<never> => {
    this._loggerSvc.log('error', error);
    const errorMsg: string = error.message;
    if (error instanceof HttpErrorResponse) {
      if (401 === error.status) {
        return fromPromise(this._router.navigate(['/logout'])).pipe(
          catchError(() => EMPTY$),
          concatMap(() => EMPTY$),
          take(1)
        );
      }
    }

    return throwError$(error);
  };

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public get<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .get<T>(this.extractUrl(endpoint), {
        headers: this.setHeaders({ Accept: 'application/json' }),
        observe: 'body',
        params,
        responseType: 'json',
        withCredentials: false,
        reportProgress: false
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {*} [body={}]
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public put<T>(
    endpoint: string,
    body: any = {},
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .put<T>(this.extractUrl(endpoint), JSON.stringify(body), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {*} [body={}]
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public post<T>(
    endpoint: string,
    body: any = {},
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .post<T>(this.extractUrl(endpoint), JSON.stringify(body), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public delete<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .delete<T>(this.extractUrl(endpoint), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {*} [body={}]
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  public patch<T>(
    endpoint: string,
    body: any = {},
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<any> {
    return this._http
      .patch<T>(this.extractUrl(endpoint), JSON.stringify(body), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {File} file
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public file<T>(
    endpoint: string,
    file: File,
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<T> {
    return fromPromise(
      new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();
        reader.onerror = () => reject(new Error('Cannot read file!'));
        reader.onload = () => {
          resolve(
            this.param<any>({
              name: file.name,
              size: file.size,
              type: file.type,
              blob: reader.result
            })
          );
        };
        reader.readAsDataURL(file);
      })
    ).pipe(
      concatMap((payload: any) =>
        this.post<T>(endpoint, payload, params, requestTimeout)
      )
    );
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<Blob>}
   * @memberof ApiService
   */
  public pdf<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<Blob> {
    return this._http
      .get(this.extractUrl(endpoint), {
        headers: this.setHeaders({ 'Content-Type': 'application/pdf' }),
        observe: 'response',
        responseType: 'blob',
        withCredentials: false,
        reportProgress: false,
        params
      })
      .pipe(
        timeout(requestTimeout),
        map(
          (response: HttpResponse<Blob>) =>
            new Blob([response.body], { type: 'application/pdf' })
        ),
        // map((response: HttpResponse<Observable<Blob>>) => new Blob([response], { type: 'application/pdf' }))
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<Blob>;
  }

  /**
   *
   *
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {*} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<string>}
   * @memberof ApiService
   */
  public svg(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout = environment.threshold.requestTimeout
  ): Observable<string> {
    return this._http
      .get(this.extractUrl(endpoint), {
        headers: this.setHeaders({ Accept: 'image/svg+xml' }),
        responseType: 'text',
        observe: 'body',
        params,
        withCredentials: false,
        reportProgress: false
      })
      .pipe(
        timeout(requestTimeout),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<string>;
  }

  /**
   * @description something like angularJs HttpParamSerializer$
   * @private
   * @param {HttpParams} [params=new HttpParams()]
   * @returns {*}
   * @memberof ApiService
   */
  private paramSerializer<T>(params: HttpParams = new HttpParams()): T {
    if (params instanceof HttpParams) {
      const _params: any = {};
      _.toArray(params.keys()).map(
        (param: string) => (_params[param] = params.get(param))
      );
      return _params as T;
    }

    return null;
  }

  /**
   * @description generate parameter from HttpParams
   * @template T
   * @param {HttpParams} [params=new HttpParams()]
   * @returns {T}
   * @memberof ApiService
   */
  public query<T>(params: HttpParams = new HttpParams()): T {
    return this.paramSerializer<T>(params) as T;
  }

  /**
   * generate parameter from object
   *
   * @template T
   * @param {*} [params={}]
   * @returns {T}
   * @memberof ApiService
   */
  public param<T>(params: any = {}): T {
    return params as T;
  }
}
