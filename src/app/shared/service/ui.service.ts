import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent as fromEvent$ } from 'rxjs';
import {
  throttleTime,
  map,
  share,
  startWith,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class UiService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class UiService implements OnDestroy {
  /**
   *
   *
   * @type {UIEvent}
   * @memberof UiService
   */
  public get scroll(): UIEvent {
    return this._scrollSubject.getValue();
  }

  /**
   *
   *
   * @memberof UiService
   */
  public set scroll($event: UIEvent) {
    this._scrollSubject.next($event);
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<UIEvent>}
   * @memberof UiService
   */
  private _scrollSubject: BehaviorSubject<UIEvent> = new BehaviorSubject<
    UIEvent
  >(null);

  /**
   *
   *
   * @type {Observable<UIEvent>}
   * @memberof UiService
   */
  public scroll$: Observable<UIEvent> = this._scrollSubject
    .asObservable()
    .pipe(filter(($event: UIEvent) => $event !== null));

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof UiService
   */
  private _screenThreshold: number = 1200;

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof UiService
   */
  public screenSizeChanged$: Observable<boolean> = null;

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof UiService
   */
  public isSmallScreen$: Observable<boolean> = null;

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof UiService
   */
  private _isAsideOpen: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof UiService
   */
  public set isAsideOpen(isAsideOpen: boolean) {
    this._isAsideOpen = isAsideOpen;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof UiService
   */
  public get isAsideOpen(): boolean {
    return this._isAsideOpen;
  }

  /**
   *Creates an instance of UiService.
   * @memberof UiService
   */
  public constructor() {
    const detectScreenSize: any = (): boolean =>
      document.body.offsetWidth < this._screenThreshold;
    this.screenSizeChanged$ = fromEvent$(window, 'resize').pipe(
      throttleTime(500),
      map(detectScreenSize)
    );
    this.isSmallScreen$ = this.screenSizeChanged$.pipe(
      startWith(detectScreenSize()),
      share()
    );
  }

  /**
   *
   *
   * @memberof UiService
   */
  public ngOnDestroy(): void {
    this._scrollSubject.complete();
  }
}
