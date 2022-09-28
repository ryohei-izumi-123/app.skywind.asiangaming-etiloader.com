import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '@shared/service/auth.service';

/**
 *
 *
 * @export
 * @class AuthResolver
 * @implements {Resolve<boolean>}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  /**
   *Creates an instance of AuthResolver.
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @memberof AuthResolver
   */
  constructor(private _authSvc: AuthService, private _router: Router) {}

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>}
   * @memberof AuthResolver
   */
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._authSvc.isAuthenticated$.pipe(take(1));
  }
}
