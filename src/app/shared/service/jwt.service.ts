import { Inject, Injectable, OnDestroy } from '@angular/core';
import { StorageService } from '@shared/service/storage.service';
import { APP_AUTH_TOKEN, toTokenize } from '@shared/token';

/**
 *
 *
 * @export
 * @class JwtService
 */
@Injectable({
  providedIn: 'root'
})
export class JwtService implements OnDestroy {
  /**
   *Creates an instance of JwtService.
   * @param {StorageService} _storageSvc
   * @memberof JwtService
   */
  constructor(@Inject(StorageService) private _storageSvc: StorageService) {}

  /**
   *
   *
   * @memberof JwtService
   */
  public ngOnDestroy() {}

  /**
   *
   *
   * @returns {string}
   * @memberof JwtService
   */
  public get(): string {
    return this._storageSvc.get(toTokenize(APP_AUTH_TOKEN));
  }

  /**
   *
   *
   * @param {string} value
   * @memberof JwtService
   */
  public set(value: string): void {
    this._storageSvc.set(toTokenize(APP_AUTH_TOKEN), value);
  }

  /**
   *
   *
   * @memberof JwtService
   */
  public delete(): void {
    this._storageSvc.remove(toTokenize(APP_AUTH_TOKEN));
  }
}
