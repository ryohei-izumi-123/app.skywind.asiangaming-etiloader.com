import { environment } from '@env/environment';
import { Injector, Injectable, VERSION } from '@angular/core';
import { of as of$, from as fromPromise } from 'rxjs';
import { take, tap, catchError, flatMap, retry } from 'rxjs/operators';
import * as _ from 'lodash';
import {
  IGame,
  IGameSettings,
  IPTLiveGame,
  IGameCategory
} from '@shared/interface';
import { LoggerService, GameService } from '@shared/service';

/**
 *
 *
 * @see https://www.intertech.com/Blog/angular-4-tutorial-run-code-during-app-initialization/
 * アプリ起動前に実行しておきたい処理を登録する。
 * app.moduleのbootstrapでAPP_INITIALIZERとして登録している。
 * なお、APP_INITIALIZERは複数登録可能。
 * @export
 * @class AppInitializer
 */
@Injectable({
  providedIn: 'root'
})
export class AppInitializer {
  /**
   *
   *
   * @private
   * @type {number}
   * @memberof AppInitializer
   */
  private _retry: number = 3;

  /**
   *Creates an instance of AppInitializer.
   * @param {Injector} _injector
   * @memberof AppInitializer
   */
  public constructor(private _injector: Injector) {}

  /**
   *
   *
   * @returns {Promise<IGame[]>}
   * @memberof AppInitializer
   */
  private getGames(): Promise<IGame[]> {
    const _gameSvc: GameService = this._injector.get(GameService);

    return new Promise((resolve, reject) =>
      _gameSvc
        .getAll$()
        .pipe(
          retry(this._retry),
          tap((response: IGame[]) => (_gameSvc.allGames = response)),
          catchError((error: Error) => of$(error)),
          take(1)
        )
        .subscribe((response: IGame[]) => {
          const isError: boolean = _.isError(response);
          return isError ? reject(response) : resolve(response);
        })
    );
  }

  /**
   *
   *
   * @template T
   * @param {string} json
   * @returns {T}
   * @memberof AppInitializer
   */
  parseJSON<T>(json: string): T {
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      return null;
    }
  }

  /**
   *
   *
   * @returns {Promise<IGameSettings>}
   * @memberof AppInitializer
   */
  private getGameSettings(): Promise<IGameSettings> {
    const _gameSvc: GameService = this._injector.get(GameService);
    return new Promise((resolve, reject) =>
      _gameSvc
        .getGameSettings$()
        .pipe(
          retry(this._retry),
          tap((response: IGameSettings) => (_gameSvc.settings = response)),
          catchError((error: Error) => of$(error)),
          take(1)
        )
        .subscribe((response: IGameSettings) => {
          const isError: boolean = _.isError(response);
          return isError ? reject(response) : resolve(response);
        })
    );
  }

  /**
   *
   *
   * @returns {Promise<IPTLiveGame[]>}
   * @memberof AppInitializer
   */
  private getLiveGameSettings(): Promise<IPTLiveGame[]> {
    const _gameSvc: GameService = this._injector.get(GameService);
    return new Promise((resolve, reject) =>
      _gameSvc
        .getLiveGameSettings$()
        .pipe(
          retry(this._retry),
          tap((response: IPTLiveGame[]) => (_gameSvc.liveOptions = response)),
          catchError((error: Error) => of$(error)),
          take(1)
        )
        .subscribe((response: IPTLiveGame[]) => {
          const isError: boolean = _.isError(response);
          return isError ? reject(response) : resolve(response);
        })
    );
  }

  /**
   *
   *
   * @returns {Promise<IGameCategory[]>}
   * @memberof AppInitializer
   */
  private getGameCategories(): Promise<IGameCategory[]> {
    const _gameSvc: GameService = this._injector.get(GameService);
    return new Promise((resolve, reject) =>
      _gameSvc
        .getGameCategories$()
        .pipe(
          retry(this._retry),
          tap((response: IGameCategory[]) => {
            _gameSvc.categories = response;
            if (response.length) {
              const [$0]: IGameCategory[] = response;
              _gameSvc.category = $0;
            }
          }),
          catchError((error: Error) => of$(error)),
          take(1)
        )
        .subscribe((response: IGameCategory[]) => {
          const isError: boolean = _.isError(response);
          return isError ? reject(response) : resolve(response);
        })
    );
  }

  /**
   *
   *
   * @returns {Promise<any>}
   * @memberof AppInitializer
   */
  public init(): Promise<any> {
    const _loggerSvc: LoggerService = this._injector.get(LoggerService);
    const app: string = `🎰 ${environment.name} v${environment.version}/${VERSION.full} 🎲`;
    if (!environment.production) {
      _loggerSvc.log('info', app);
    }

    return of$(app)
      .pipe(
        flatMap((v: any) => fromPromise(this.getGameSettings())),
        flatMap((v: any) => fromPromise(this.getLiveGameSettings())),
        flatMap((v: any) => fromPromise(this.getGameCategories())),
        flatMap((v: any) => fromPromise(this.getGames()))
      )
      .toPromise();
  }
}
