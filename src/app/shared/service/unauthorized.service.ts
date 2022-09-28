import { Inject, Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { JwtService } from '@shared/service/jwt.service';
import { ElectronService } from '@shared/service/electron.service';
import { filter, take } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class UnauthorizedService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class UnauthorizedService implements OnDestroy {
  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof UnauthorizedService
   */
  public expired$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof UnauthorizedService
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of UnauthorizedService.
   * @param {ElectronService} _electronSvc
   * @param {JwtService} _jwtSvc
   * @memberof UnauthorizedService
   */
  public constructor(
    @Inject(ElectronService) private _electronSvc: ElectronService,
    @Inject(JwtService) private _jwtSvc: JwtService
  ) {
    this.init();
  }

  /**
   *
   *
   * @private
   * @memberof UnauthorizedService
   */
  private init(): void {
    this._subscription.add(
      this.expired$
        .pipe(
          filter((expired: boolean) => expired),
          take(1)
        )
        .subscribe((expired: boolean) => this.purge())
    );
  }

  /**
   *
   *
   * @memberof UnauthorizedService
   */
  public ngOnDestroy() {
    this.expired$.complete();
    this._subscription.unsubscribe();
  }

  /**
   *
   *
   * @returns {void}
   * @memberof UnauthorizedService
   */
  public purge(): void {
    this._electronSvc.sendRequestLogout();
    this._jwtSvc.delete();
    window.setTimeout(() => (window.location.href = './index.html'), 300);
  }
}
