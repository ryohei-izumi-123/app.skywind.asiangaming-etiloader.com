import { Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Observable, interval as interval$, NEVER as NEVER$ } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClockService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {Observable<moment.Moment>}
   * @memberof ClockService
   */
  private _clock$: Observable<moment.Moment>;

  /**
   *Creates an instance of ClockService.
   * @param {NgZone} _ngZone
   * @memberof ClockService
   */
  public constructor(@Inject(NgZone) private _ngZone: NgZone) {
    this._clock$ = interval$(1000).pipe(
      map((i: number) => moment().clone()),
      share()
    );
  }

  /**
   *
   *
   * @readonly
   * @type {Observable<moment.Moment>}
   * @memberof ClockService
   */
  public get clock$(): Observable<moment.Moment> {
    return this._clock$;
  }

  /**
   *
   *
   * @memberof ClockService
   */
  public ngOnDestroy(): void {
    this._clock$ = NEVER$;
  }
}
