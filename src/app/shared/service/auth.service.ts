import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy, EventEmitter } from '@angular/core';
import {
  Subscription,
  interval as interval$,
  merge as merge$,
  Observable,
  BehaviorSubject,
  ReplaySubject,
  throwError as throwError$,
  EMPTY as EMPTY$
} from 'rxjs';
import {
  take,
  tap,
  skipWhile,
  distinctUntilChanged,
  catchError,
  finalize,
  concatMap,
  filter,
  debounceTime,
  map,
  throttleTime
} from 'rxjs/operators';
import * as _ from 'lodash';
import { ApiService } from '@shared/service/api.service';
import { UnauthorizedService } from '@shared/service/unauthorized.service';
import { JwtService } from '@shared/service/jwt.service';
import { ElectronService } from '@shared/service/electron.service';
import { ILogin, ILoginParam, IPlayer, IResult } from '@shared/interface';

/**
 *
 *
 * @export
 * @class AuthService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  public trigger$: EventEmitter<boolean> = new EventEmitter();
  /**
   *
   *
   * @private
   * @type {number}
   * @memberof AuthService
   */
  private _interval: number = 30000;

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IPlayer>}
   * @memberof AuthService
   */
  private _playerSubject: BehaviorSubject<IPlayer> = new BehaviorSubject<
    IPlayer
  >(null);

  /**
   *
   *
   * @type {Observable<IPlayer>}
   * @memberof AuthService
   */
  public player$: Observable<IPlayer> = this._playerSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @private
   * @type {ReplaySubject<boolean>}
   * @memberof AuthService
   */
  private _isAuthenticatedSubject: ReplaySubject<boolean> = new ReplaySubject<
    boolean
  >(1);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof AuthService
   */
  public isAuthenticated$: Observable<
    boolean
  > = this._isAuthenticatedSubject.asObservable().pipe();

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof AuthService
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of AuthService.
   * @param {UnauthorizedService} _unauthorizedSvc
   * @param {ElectronService} _electronSvc
   * @param {ApiService} _apiSvc
   * @param {JwtService} _jwtSvc
   * @memberof AuthService
   */
  public constructor(
    @Inject(UnauthorizedService) private _unauthorizedSvc: UnauthorizedService,
    @Inject(ElectronService) private _electronSvc: ElectronService,
    @Inject(ApiService) private _apiSvc: ApiService,
    @Inject(JwtService) private _jwtSvc: JwtService
  ) {
    this.init();
  }

  /**
   *
   *
   * @private
   * @memberof AuthService
   */
  private init(): void {
    this.player = null;
    this._subscription.add(this.player$.subscribe());
    this._subscription.add(this.isAuthenticated$.subscribe());
    this._subscription.add(
      merge$(
        interval$(0).pipe(take(1)),
        interval$(this._interval),
        merge$(this._electronSvc.windowState$, this.trigger$).pipe(
          filter((value: boolean) => value),
          debounceTime(1000)
        )
      )
        .pipe(
          skipWhile(() => !!!this.hasToken),
          throttleTime(10000),
          concatMap(() => this.getPlayer$())
        )
        .subscribe((player: IPlayer) => (this.player = player))
    );
  }

  /**
   *
   *
   * @memberof AuthService
   */
  public ngOnDestroy() {
    this._playerSubject.complete();
    this._isAuthenticatedSubject.complete();
    this._subscription.unsubscribe();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof AuthService
   */
  private get hasToken(): boolean {
    return _.isEmpty(this._jwtSvc.get()) === false;
  }

  /**
   *
   *
   * @param {IPlayer} player
   * @memberof AuthService
   */
  public set player(player: IPlayer) {
    this._playerSubject.next(player);
    this._isAuthenticatedSubject.next(player ? true : false);
  }

  /**
   *
   *
   * @returns {IPlayer}
   * @memberof AuthService
   */
  public get player(): IPlayer {
    return (<IPlayer>this._playerSubject.getValue()) as IPlayer;
  }

  /**
   *
   *
   * @returns {Observable<IPlayer>}
   * @memberof AuthService
   */
  public getPlayer$(): Observable<IPlayer> {
    return this._apiSvc
      .get<IPlayer>(`${environment.api.endpoint.api}/auth/player`)
      .pipe(
        tap((player: IPlayer) => (this.player = player)),
        catchError((error: Error) => throwError$(error)),
        take(1)
      );
  }

  /**
   *
   *
   * @param {payload} ILoginParam
   * @returns {Observable<ILogin>}
   * @memberof AuthService
   */
  public attempt$(payload: ILoginParam): Observable<ILogin> {
    return this._apiSvc
      .post<ILogin>(`${environment.api.endpoint.api}/auth/player`, payload)
      .pipe(
        tap((response: ILogin) => this._jwtSvc.set(response.accessToken)),
        take(1)
      );
  }

  /**
   *
   *
   * @returns {Observable<IResult>}
   * @memberof AuthService
   */
  public signOut$(): Observable<IResult> {
    return this._apiSvc
      .delete<IResult>(`${environment.api.endpoint.api}/auth/player`)
      .pipe(
        finalize(() => this._unauthorizedSvc.expired$.emit(true)),
        catchError(() => EMPTY$),
        take(1)
      );
  }
}
