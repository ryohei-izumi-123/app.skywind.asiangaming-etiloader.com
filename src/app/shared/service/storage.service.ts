import { NgZone, OnDestroy, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent as fromEvent$ } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class StorageService
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {Storage}
   * @memberof StorageService
   */
  private _storage: Storage = window.localStorage;

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof StorageService
   */
  private _changeSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof StorageService
   */
  public change$: Observable<boolean> = this._changeSubject
    .asObservable()
    .pipe(filter((changed: boolean) => changed));

  /**
   *Creates an instance of StorageService.
   * @memberof StorageService
   */
  public constructor(private _ngZone: NgZone) {
    this._ngZone.runOutsideAngular(() =>
      fromEvent$(window, 'storage')
        .pipe(
          filter(($event: StorageEvent) => $event.storageArea === this._storage)
        )
        .subscribe(() => this._ngZone.run(() => this._changeSubject.next(true)))
    );
  }

  /**
   *
   *
   * @memberof StorageService
   */
  public ngOnDestroy() {
    this._changeSubject.complete();
  }

  /**
   *
   *
   * @param {string} key
   * @returns {any}
   * @memberof StorageService
   */
  public get(key: string): any {
    let result: any;
    const json: string = this._storage.getItem(key);
    if (json) {
      try {
        result = JSON.parse(<string>json);
      } catch (error) {
        result = json;
      }
    }

    return result;
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} value
   * @memberof StorageService
   */
  public set(key: string, value: any): void {
    let json: string;
    try {
      json = JSON.stringify(value);
    } catch (error) {
      json = value;
    }
    this._storage.setItem(key, json);
    this._changeSubject.next(true);
  }

  /**
   *
   *
   * @param {string} key
   * @memberof StorageService
   */
  public remove(key: string): void {
    this._storage.removeItem(key);
    this._changeSubject.next(true);
  }

  /**
   *
   *
   * @memberof StorageService
   */
  public clear(): void {
    this._storage.clear();
    this._changeSubject.next(true);
  }
}
