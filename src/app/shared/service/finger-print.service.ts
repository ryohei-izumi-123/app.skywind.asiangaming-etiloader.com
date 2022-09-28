import { Inject, Injectable, OnDestroy, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { skipWhile, take, distinctUntilChanged } from 'rxjs/operators';
import * as Fingerprint2 from 'fingerprintjs2';
import * as _ from 'lodash';
import { DeviceDetectorService } from '@shared/service/device-detector.service';

/**
 *
 *
 * @export
 * @class FingerPrintService
 */
@Injectable({
  providedIn: 'root'
})
export class FingerPrintService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<string>}
   * @memberof FingerPrintService
   */
  private _valueSubject: BehaviorSubject<string>;

  /**
   *
   *
   * @private
   * @type {Observable<string>}
   * @memberof FingerPrintService
   */
  private _value$: Observable<string>;

  /**
   *Creates an instance of FingerPrintService.
   * @param {NgZone} _ngZone
   * @memberof FingerPrintService
   */
  public constructor(
    @Inject(NgZone) private _ngZone: NgZone,
    @Inject(DeviceDetectorService)
    private _deviceDetectorSvc: DeviceDetectorService
  ) {
    this._valueSubject = new BehaviorSubject(null);
    this._value$ = this._valueSubject
      .asObservable()
      .pipe(distinctUntilChanged());

    const isSecure: boolean =
      false === _.toString(window.location.protocol).startsWith('https');
    const options = {
      excludes: {
        deviceMemory: isSecure,
        userAgent: true,
        language: true
      },
      preprocessor: (key: string, value: string) => {
        if (key !== 'userAgent') {
          return value;
        }

        const os: string = this._deviceDetectorSvc.deviceInfo.os;
        const browser: string = this._deviceDetectorSvc.deviceInfo.browser;

        return `${os} ${browser}`;
      }
    };
    const callback: Function = (components: any[]) =>
      this._ngZone.run(() =>
        this._valueSubject.next(
          Fingerprint2.x64hash128(
            components.map((component: any) => component.value).join(''),
            31
          )
        )
      );
    this._ngZone.runOutsideAngular(() => Fingerprint2.get(options, callback));
  }

  /**
   *
   *
   * @memberof FingerPrintService
   */
  public ngOnDestroy() {
    this._valueSubject.complete();
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof FingerPrintService
   */
  public get value(): string {
    return this._valueSubject.getValue() || undefined;
  }

  /**
   *
   *
   * @readonly
   * @type {Observable<string>}
   * @memberof FingerPrintService
   */
  public get value$(): Observable<string> {
    return this._value$.pipe(
      skipWhile((v: string) => v === null),
      take(1)
    );
  }
}
