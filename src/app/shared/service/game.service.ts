import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  Subscription,
  NEVER as NEVER$,
  EMPTY as EMPTY$,
  interval as interval$
} from 'rxjs';
import {
  take,
  distinctUntilChanged,
  filter,
  catchError,
  concatMap
} from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ApiService } from '@shared/service/api.service';
import { AuthService } from '@shared/service/auth.service';
import { TIso6391, TGameSortOrder } from '@shared/type';
import {
  IPlayer,
  IGame,
  IGameSetting,
  IGameSettings,
  IGameLocales,
  IGameUrl,
  IPTLiveGame,
  IGameCategory,
  TGameFeatureLiveType,
  IGameLimit,
  IGameLimits,
  IGameGroupLimits
} from '@shared/interface';

/**
 *
 *
 * @export
 * @class GameService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {
  /**
   *
   * @private
   * @type {Map<string, (keyof IGameLimits)>}
   * @memberof GameService
   */
  private _limitMap: Map<string, keyof IGameLimits> = new Map();

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameService
   */
  public set limitSelector(game: IGame) {
    this._limitSelectorSubject.next(game);
  }

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameService
   */
  public get limitSelector(): IGame {
    return this._limitSelectorSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IGame>}
   * @memberof GameService
   */
  private _limitSelectorSubject: BehaviorSubject<IGame> = new BehaviorSubject<
    IGame
  >(null);

  /**
   *
   *
   * @type {Observable<IGame>}
   * @memberof GameService
   */
  public limitSelector$: Observable<
    IGame
  > = this._limitSelectorSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @readonly
   * @type {TGameSortOrder}
   * @memberof GameService
   */
  public set sort(sort: TGameSortOrder) {
    this._sortSubject.next(sort);
  }

  /**
   *
   *
   * @readonly
   * @type {TGameSortOrder}
   * @memberof GameService
   */
  public get sort(): TGameSortOrder {
    return this._sortSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<TGameSortOrder>}
   * @memberof GameService
   */
  private _sortSubject: BehaviorSubject<TGameSortOrder> = new BehaviorSubject<
    TGameSortOrder
  >(null);

  /**
   *
   *
   * @type {Observable<TGameSortOrder>}
   * @memberof GameService
   */
  public sort$: Observable<
    TGameSortOrder
  > = this._sortSubject.asObservable().pipe(
    filter((sort: TGameSortOrder) => sort !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @type {IGameCategory}
   * @memberof GameService
   */
  public get category(): IGameCategory {
    return this._categorySubject.getValue();
  }

  /**
   *
   *
   * @memberof GameService
   */
  public set category(category: IGameCategory) {
    this._categorySubject.next(category);
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IGameCategory>}
   * @memberof GameService
   */
  private _categorySubject: BehaviorSubject<
    IGameCategory
  > = new BehaviorSubject<IGameCategory>(null);

  /**
   *
   *
   * @type {Observable<IGameCategory>}
   * @memberof GameService
   */
  public category$: Observable<
    IGameCategory
  > = this._categorySubject.asObservable().pipe(
    filter((category: IGameCategory) => category !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @type {string}
   * @memberof GameService
   */
  public get filter(): string {
    return this._filterSubject.getValue();
  }

  /**
   *
   *
   * @memberof GameService
   */
  public set filter(value: string) {
    this._filterSubject.next(value);
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<string>}
   * @memberof GameService
   */
  private _filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   *
   *
   * @type {Observable<string>}
   * @memberof GameService
   */
  public filter$: Observable<string> = this._filterSubject.asObservable().pipe(
    filter((value: string) => value !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IPTLiveGame[]>}
   * @memberof GameService
   */
  private _liveOptionsSubject: BehaviorSubject<
    IPTLiveGame[]
  > = new BehaviorSubject<IPTLiveGame[]>(null);

  /**
   *
   *
   * @type {Observable<IPTLiveGame[]>}
   * @memberof GameService
   */
  public liveOptions$: Observable<
    IPTLiveGame[]
  > = this._liveOptionsSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @param {IPTLiveGame[]} games
   * @returns {void}
   * @memberof GameService
   */
  public get liveOptions(): IPTLiveGame[] {
    return this._liveOptionsSubject.getValue();
  }

  /**
   *
   *
   * @param {IPTLiveGame[]} settings
   * @returns {void}
   * @memberof GameService
   */
  public set liveOptions(settings: IPTLiveGame[]) {
    if (_.isEmpty(settings)) {
      settings = [];
    }

    this._liveOptionsSubject.next(settings);
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IGameSettings>}
   * @memberof GameService
   */
  private _settingsSubject: BehaviorSubject<
    IGameSettings
  > = new BehaviorSubject<IGameSettings>(null);

  /**
   *
   *
   * @type {Observable<IGameSettings>}
   * @memberof GameService
   */
  public settings$: Observable<
    IGameSettings
  > = this._settingsSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {void}
   * @memberof GameService
   */
  public get settings(): IGameSettings {
    return this._settingsSubject.getValue();
  }

  /**
   *
   *
   * @param {IGameSettings} settings
   * @returns {void}
   * @memberof GameService
   */
  public set settings(settings: IGameSettings) {
    this._settingsSubject.next(settings);
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IGame[]>}
   * @memberof GameService
   */
  private _gamesSubject: BehaviorSubject<IGame[]> = new BehaviorSubject<
    IGame[]
  >([]);

  /**
   *
   *
   * @type {Observable<IGame[]>}
   * @memberof GameService
   */
  public games$: Observable<IGame[]> = this._gamesSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {IGame[]}
   * @memberof GameService
   */
  public get games(): IGame[] {
    return this._gamesSubject.getValue();
  }

  /**
   *
   *
   * @param {IGame[]} games
   * @returns {void}
   * @memberof GameService
   */
  public set games(games: IGame[]) {
    this._gamesSubject.next(games);
  }

  /**
   *
   *
   * @private
   * @type {IGame[]}
   * @memberof GameService
   */
  private _allGames: IGame[] = [];

  /**
   *
   *
   * @returns {IGame[]}
   * @memberof GameService
   */
  public get allGames(): IGame[] {
    return this._allGames;
  }

  /**
   *
   *
   * @param {IGame[]} games
   * @returns {void}
   * @memberof GameService
   */
  public set allGames(games: IGame[]) {
    this._allGames = games;
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IGameCategory[]>}
   * @memberof GameService
   */
  private _categoriesSubject: BehaviorSubject<
    IGameCategory[]
  > = new BehaviorSubject<IGameCategory[]>([]);

  /**
   *
   *
   * @type {Observable<IGameCategory[]>}
   * @memberof GameService
   */
  public categories$: Observable<
    IGameCategory[]
  > = this._categoriesSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {IGameCategory[]}
   * @memberof GameService
   */
  public get categories(): IGameCategory[] {
    return this._categoriesSubject.getValue();
  }

  /**
   *
   *
   * @param {IGameCategory[]} categories
   * @returns {void}
   * @memberof GameService
   */
  public set categories(categories: IGameCategory[]) {
    this._categoriesSubject.next(categories);
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IGameGroupLimits[]>}
   * @memberof GameService
   */
  private _gameLimitsSubject: BehaviorSubject<
    IGameGroupLimits[]
  > = new BehaviorSubject<IGameGroupLimits[]>([]);

  /**
   *
   *
   * @type {Observable<IGameGroupLimits[]>}
   * @memberof GameService
   */
  public gameLimits$: Observable<
    IGameGroupLimits[]
  > = this._gameLimitsSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {IGameGroupLimits[]}
   * @memberof GameService
   */
  public get gameLimits(): IGameGroupLimits[] {
    return this._gameLimitsSubject.getValue();
  }

  /**
   *
   *
   * @param {IGameGroupLimits[]} gameLimits
   * @returns {void}
   * @memberof GameService
   */
  public set gameLimits(gameLimits: IGameGroupLimits[]) {
    this._gameLimitsSubject.next(gameLimits);
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof GameService
   */
  public get globalCurrencySymbol(): string {
    return environment.currency === 'JPY' ? '¥' : '$';
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof GameService
   */
  private _interval: number = 1000 * 60 * 1;

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameService
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameService.
   * @param {ApiService} _apiSvc
   * @memberof GameService
   */
  public constructor(
    @Inject(ApiService) private _apiSvc: ApiService,
    @Inject(AuthService) private _authSvc: AuthService
  ) {
    this._subscription.add(
      this._authSvc.player$
        .pipe(
          distinctUntilChanged(
            (oldVal: IPlayer, newVal: IPlayer) =>
              _.get(oldVal, 'playerCode') === _.get(newVal, 'playerCode')
          ),
          concatMap((player: IPlayer) => this.getGameGroupLimits$(player))
        )
        .subscribe(
          (gameLimits: IGameGroupLimits[]) => (this.gameLimits = gameLimits)
        )
    );
    this._subscription.add(
      interval$(this._interval)
        .pipe(
          concatMap(() => this.getLiveGameSettings$()),
          catchError(() => NEVER$)
        )
        .subscribe((response: IPTLiveGame[]) => (this.liveOptions = response))
    );
  }

  /**
   *
   *
   * @memberof GameService
   */
  public ngOnDestroy() {
    this._limitSelectorSubject.complete();
    this._sortSubject.complete();
    this._categoriesSubject.complete();
    this._filterSubject.complete();
    this._liveOptionsSubject.complete();
    this._settingsSubject.complete();
    this._gamesSubject.complete();
    this._categorySubject.complete();
    this._gameLimitsSubject.complete();
    this._subscription.unsubscribe();
  }

  /**
   *
   *
   * @param {IGame} game
   * @param {keyof IGameLimits} limit
   * @memberof GameService
   */
  public setLimit(game: IGame, limit: keyof IGameLimits): void {
    if (_.has(game, 'code')) {
      this._limitMap.set(game.code, limit);
    }
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {keyof IGameLimits}
   * @memberof GameService
   */
  public getLimit(game: IGame): keyof IGameLimits {
    if (_.has(game, 'code') && this._limitMap.has(game.code)) {
      return this._limitMap.get(game.code);
    }

    return 'low';
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {IGameSetting}
   * @memberof GameService
   */
  public pluckSettingByCode(game: IGame): IGameSetting {
    if (
      _.has(game, 'code') &&
      _.has(this.settings, 'games') &&
      _.has(this.settings.games, game.code)
    ) {
      return _.get(this.settings.games, game.code);
    }

    return null;
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {boolean}
   * @memberof GameService
   */
  public isLiveDealerGame(game: IGame): boolean {
    return (
      _.has(game, 'code') &&
      _.has(game, 'features.live') &&
      _.has(game, 'features.live.tableId')
    );
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {TGameFeatureLiveType}
   * @memberof GameService
   */
  public getLiveGameType(game: IGame): TGameFeatureLiveType {
    if (_.has(game, 'code') && _.has(game, 'features.live.type')) {
      return _.get(game, 'features.live.type');
    }

    return null;
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {string}
   * @memberof GameService
   */
  public getLiveGameTableTime(game: IGame): string {
    if (_.has(game, 'code') && _.has(game, 'features.live.tableTime')) {
      return _.get(game, 'features.live.tableTime');
    }

    return null;
  }

  /**
   * @note if you want to get timezone from browser, you can get `const timezeon: string = Intl.DateTimeFormat().resolvedOptions().timeZone;`
   * @param {IGame} game
   * @returns {Moment}
   * @memberof GameService
   */
  public getLiveGameTableTimeAsMoment(game: IGame): Moment {
    const utcOffset: number = moment().utcOffset();
    const minutesPerHour: number = 60;
    const offset: number = utcOffset / minutesPerHour;
    const now: Moment = moment().clone();
    const time: string = this.getLiveGameTableTime(game);
    const delimiter: string = ':';
    const isTime: boolean = _.toString(time).includes(delimiter);
    if (isTime) {
      const [$hour, $minute]: string[] = time.split(delimiter);
      const startAt: Moment = now
        .clone()
        .set('hour', _.toNumber($hour) + offset)
        .set('minute', _.toNumber($minute));
      const isValid: boolean = moment.isMoment(startAt);
      const isBefore: boolean = now.clone().isBefore(startAt);
      if (isValid) {
        if (isBefore) {
          return startAt;
        }

        return startAt.add(1, 'day');
      }
    }

    return null;
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {boolean}
   * @memberof GameService
   */
  public isLiveDealerGameOffline(game: IGame): boolean {
    if (this.isLiveDealerGame(game)) {
      const found: IPTLiveGame = this.liveOptions.find(
        (value: IPTLiveGame) =>
          _.toNumber(value.id) === _.toNumber(game.features.live.tableId)
      );
      if (!_.isEmpty(found)) {
        return found.status === 'offline';
      }
    }

    return false;
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {IPTLiveGame}
   * @memberof GameService
   */
  public pluckLiveOptionByCode(game: IGame): IPTLiveGame {
    if (this.isLiveDealerGame(game)) {
      const found: IPTLiveGame = this.liveOptions.find(
        (liveOption: IPTLiveGame) =>
          _.toNumber(liveOption.id) === _.toNumber(game.features.live.tableId)
      );
      if (!_.isEmpty(found)) {
        return found;
      }
    }

    return null;
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {IGameLimits}
   * @memberof GameService
   */
  public getGameLimits(game: IGame): IGameLimits {
    const found: IGameGroupLimits = this.gameLimits.find(
      (gameLimit: IGameGroupLimits) => _.has(gameLimit, game.code)
    );
    if (found) {
      return _.get(found, game.code);
    }

    if (_.has(game, `limits.${environment.currency}`)) {
      return _.get(game, `limits.${environment.currency}`);
    }

    return _.create({});
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {IPTLiveGame}
   * @memberof GameService
   */
  public getMaxWin(game: IGame): number {
    const limits: IGameLimits = this.getGameLimits(game);
    switch (game.type) {
      case 'table':
        return this.getStakeMax(game, 'high');

      case 'action':
        if (
          _.has(limits, 'coinsRate') &&
          _.has(limits, 'stakeDef') &&
          _.has(limits, 'coins')
        ) {
          return (
            _.toNumber(_.get(limits, 'coinsRate')) *
            _.toNumber(_.get(limits, 'stakeDef')) *
            _.toNumber([..._.get(limits, 'coins')].pop())
          );
        }
        break;

      case 'slot':
        if (_.has(limits, 'winMax')) {
          return _.get(limits, 'winMax');
        }
        break;
    }

    return 0;
  }

  /**
   *
   *
   * @param {IGame} game
   * @param {keyof IGameLimits} limit
   * @returns {number}
   * @memberof GameService
   */
  public getStakeMin(game: IGame, limit: keyof IGameLimits): number {
    const limits: IGameLimits = this.getGameLimits(game);
    if (_.get(limits, `${limit}.stakeMin`)) {
      return _.get(limits, `${limit}.stakeMin`);
    }

    return 0;
  }

  /**
   *
   *
   * @param {IGame} game
   * @param {keyof IGameLimits} limit
   * @returns {number}
   * @memberof GameService
   */
  public getStakeMax(game: IGame, limit: keyof IGameLimits): number {
    const limits: IGameLimits = this.getGameLimits(game);
    if (_.get(limits, `${limit}.stakeMax`)) {
      return _.get(limits, `${limit}.stakeMax`);
    }

    return 0;
  }

  /**
   *
   * @description ベットプロファイルが同一の場合ベットプロファイル変更ボタンを表示させないための評価式。
   * @param {IGame} game
   * @returns {boolean}
   * @memberof GameService
   */
  public hasSameGameLimits(game: IGame): boolean {
    if (_.isEmpty(game)) {
      return false;
    }

    const limits: IGameLimits = this.getGameLimits(game);
    const levels: (keyof IGameLimits)[] = ['high', 'mid', 'low'];
    const hasLimitLevelProps: boolean = levels.every(
      (level: keyof IGameLimits) => _.has(limits, level)
    );
    if (!hasLimitLevelProps) {
      return false;
    }

    const [$low, $mid, $high]: string[] = _.keys(limits)
      .map((prop: string) => _.get(limits, prop))
      .map((limit: IGameLimit) => JSON.stringify(limit));
    return $low === $mid && $mid === $high;
  }

  /**
   *
   *
   * @returns {Observable<IGame>}
   * @memberof GameService
   */
  public getAll$(): Observable<IGame[]> {
    return this._apiSvc
      .get<IGame[]>(`${environment.api.endpoint.api}/game`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {string} gameCode
   * @returns {Observable<IGame[]>}
   * @memberof GameService
   */
  public getByGameCode$(gameCode: string): Observable<IGame> {
    if (!gameCode) {
      return EMPTY$;
    }

    return this._apiSvc
      .get<IGame>(`${environment.api.endpoint.api}/game/${gameCode}`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {string} name
   * @returns {Observable<IGame>}
   * @memberof GameService
   */
  public getByName$(name: string): Observable<IGame> {
    if (!name) {
      return EMPTY$;
    }

    return this._apiSvc
      .get<IGame>(`${environment.api.endpoint.api}/game/${name}`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {Observable<IGameUrl>}
   * @memberof GameService
   */
  public getPlayerGameUrl$(game: IGame): Observable<IGameUrl> {
    if (!game) {
      return EMPTY$;
    }

    return this._apiSvc
      .get<IGameUrl>(`${environment.api.endpoint.api}/game/${game.code}/url`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {Observable<IGame>}
   * @memberof GameService
   */
  public getOne$(game: IGame): Observable<IGame> {
    return this.getByGameCode$(game.code);
  }

  /**
   *
   *
   * @param {IGame} game
   * @returns {Observable<IGameLimits>}
   * @memberof GameService
   */
  public getGameLimits$(game: IGame): Observable<IGameLimits> {
    return this.getGameGroupLimitsByCode$(game.code);
  }

  /**
   *
   *
   * @param {IPlayer} player
   * @returns {Observable<IGameGroupLimits[]>}
   * @memberof GameService
   */
  public getGameGroupLimits$(player: IPlayer): Observable<IGameGroupLimits[]> {
    const gameGroup: string = _.get(player, 'gameGroup') || 'default';
    return this.getGameGroupLimitsByGameGroup$(gameGroup);
  }

  /**
   *
   *
   * @param {string} code
   * @param {TIso6391} [locale='en']
   * @returns {Observable<IGameSetting>}
   * @memberof GameService
   */
  public getGameSetting$(
    code: string,
    locale: TIso6391 = 'en'
  ): Observable<IGameSetting> {
    return this._apiSvc
      .get<IGameSetting>(
        `${environment.google.storage}games/${code}/game_${locale}.json`
      )
      .pipe(take(1));
  }

  /**
   *
   *
   *
   * @param {TIso6391} [locale='en']
   * @returns {Observable<IGameSettings>}
   * @memberof GameService
   */
  public getGameSettings$(locale: TIso6391 = 'en'): Observable<IGameSettings> {
    return this._apiSvc
      .get<IGameSettings>(
        `${environment.google.storage}games/games_${locale}.json`
      )
      .pipe(take(1));
  }

  /**
   *
   *
   * @returns {Observable<IGameSetting>}
   * @memberof GameService
   */
  public getGameLocaleSetting$(): Observable<IGameLocales> {
    return this._apiSvc
      .get<IGameLocales>(
        `${environment.google.storage}languages/game-locales.json`
      )
      .pipe(take(1));
  }

  /**
   *
   *
   * @returns {Observable<IPTLiveGame[]>}
   * @memberof GameService
   */
  public getLiveGameSettings$(): Observable<IPTLiveGame[]> {
    return this._apiSvc
      .get<IPTLiveGame[]>(`${environment.api.endpoint.api}/game/pt/live`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {(number|string)} tableId
   * @returns {Observable<string>}
   * @memberof GameService
   */
  public getLiveGameScoreboard$(tableId: number | string): Observable<string> {
    return this._apiSvc
      .svg(
        `${environment.api.endpoint.api}/game/pt/live/${tableId}/scoreboard/`
      )
      .pipe(take(1));
  }

  /**
   *
   *
   * @returns {Observable<IGameCategory[]>}
   * @memberof GameService
   */
  public getGameCategories$(): Observable<IGameCategory[]> {
    return this._apiSvc
      .get<IGameCategory[]>(`${environment.api.endpoint.api}/game/category`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @returns {Observable<IGameLimits>}
   * @memberof GameService
   */
  public getGameGroupLimitsByCode$(code: string): Observable<IGameLimits> {
    return this._apiSvc
      .get<IGameLimits>(`${environment.api.endpoint.api}/game/${code}/limit`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @returns {Observable<IGameGroupLimits[]>}
   * @memberof GameService
   */
  public getGameGroupLimitsByGameGroup$(
    gameGroup: string
  ): Observable<IGameGroupLimits[]> {
    const suffix: string = '.json';
    return this._apiSvc
      .get<IGameGroupLimits[]>(
        `${environment.api.endpoint.assets}/limits/${gameGroup}${suffix}`
      )
      .pipe(take(1));
  }
}
