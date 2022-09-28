import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, from as fromPromise, EMPTY as EMPTY$ } from 'rxjs';
import { take, catchError, concatMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthService } from '@shared/service';

/**
 *
 *
 * @export
 * @class LogoutComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof LogoutComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of LogoutComponent.
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LogoutComponent
   */
  public constructor(
    private _authSvc: AuthService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof LogoutComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._authSvc
        .signOut$()
        .pipe(
          concatMap(() => fromPromise(this._router.navigate(['/login']))),
          catchError(() => EMPTY$),
          take(1)
        )
        .subscribe()
    );
  }

  /**
   *
   *
   * @memberof LogoutComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
