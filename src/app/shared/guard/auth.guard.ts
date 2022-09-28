import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  UrlSegment,
  CanLoad,
  Router,
  Route,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '@shared/service/auth.service';
import { IPlayer } from '@shared/interface';

/**
 *
 *
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  /**
   *Creates an instance of AuthGuard.
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @memberof AuthGuard
   */
  constructor(
    @Inject(AuthService) private _authSvc: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean>|Promise<boolean>|boolean)}
   * @memberof AuthGuard
   */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.activate();
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} childRoute
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean>|Promise<boolean>|boolean)}
   * @memberof AuthGuard
   */
  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.activate();
  }

  /**
   *
   *
   * @param {Route} route
   * @param {UrlSegment[]} segments
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof AuthGuard
   */
  public canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  /**
   *
   *
   * @private
   * @returns {boolean}
   * @memberof AuthGuard
   */
  private activate(): Observable<boolean> {
    return this._authSvc.getPlayer$().pipe(
      map((player: IPlayer) => player !== null),
      take(1)
    );
  }
}
