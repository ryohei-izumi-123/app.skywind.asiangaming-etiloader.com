import { LOCALE_ID, Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { APP_LANGUAGE_TOKEN, toTokenize } from '@shared/token';
import { LoggerService } from '@shared/service/logger.service';
import { StorageService } from '@shared/service/storage.service';
import { TIso6391 } from '@shared/type';
import { IIso6391 } from '@shared/interface';

/**
 *
 *
 * @export
 * @class LocaleService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {(keyof IIso6391)[]}
   * @memberof LocaleService
   */
  private _languages: (keyof IIso6391)[] = ['en', 'ja'];

  /**
   *
   *
   * @readonly
   * @type {(keyof IIso6391)[]}
   * @memberof LocaleService
   */
  public get languages(): (keyof IIso6391)[] {
    return this._languages;
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof LocaleService
   */
  public set language(language: TIso6391) {
    this._languageSubject.next(language);
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof LocaleService
   */
  public get language(): TIso6391 {
    return this._languageSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<TIso6391>}
   * @memberof LocaleService
   */
  private _languageSubject: BehaviorSubject<TIso6391> = new BehaviorSubject<
    TIso6391
  >(null);

  /**
   *
   *
   * @type {Observable<TIso6391>}
   * @memberof LocaleService
   */
  public language$: Observable<
    TIso6391
  > = this._languageSubject.asObservable().pipe(
    filter((language: TIso6391) => language !== null),
    distinctUntilChanged()
  );

  /**
   *Creates an instance of LocaleService.
   * @param {StorageService} _storageSvc
   * @param {LoggerService} _loggerSvc
   * @param {TranslateService} _translateSvc
   * @param {Document} _document
   * @param {TIso6391} _localeId
   * @memberof LocaleService
   */
  public constructor(
    @Inject(StorageService) private _storageSvc: StorageService,
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    @Inject(TranslateService) private _translateSvc: TranslateService,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(LOCALE_ID) private _localeId: TIso6391
  ) {
    this.initLanguage();
  }

  /**
   *
   *
   * @memberof LocaleService
   */
  public ngOnDestroy() {
    this._languageSubject.complete();
  }

  /**
   *
   *
   * @private
   * @memberof LocaleService
   */
  private initLanguage(): void {
    this.language$
      .pipe(
        filter((value: TIso6391) => value !== null),
        distinctUntilChanged()
      )
      .subscribe((value: TIso6391) => this.setLanguage(value));

    const language: TIso6391 =
      this._storageSvc.get(toTokenize(APP_LANGUAGE_TOKEN)) || 'ja';
    this.language = language;
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof LocaleService
   */
  private setLanguage(language: TIso6391) {
    this.language = language;
    this._localeId = language;
    this._storageSvc.set(toTokenize(APP_LANGUAGE_TOKEN), language);

    moment.locale(this._localeId);
    this._translateSvc.setDefaultLang(this._localeId);
    this._translateSvc.use(this._localeId);

    this._loggerSvc.log(
      'info',
      this._localeId,
      this._translateSvc.getBrowserCultureLang(),
      this._translateSvc.getBrowserLang(),
      this._translateSvc.getDefaultLang(),
      this._translateSvc.currentLang,
      this._translateSvc.getLangs()
    );

    const $document: HTMLElement = this._document.documentElement;
    $document.lang = this._localeId;
  }
}
