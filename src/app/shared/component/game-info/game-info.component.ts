import { environment } from '@env/environment';
import {
  Input,
  OnChanges,
  SimpleChanges,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { skipWhile, distinctUntilChanged } from 'rxjs/operators';
import * as _ from 'lodash';
import {
  IGame,
  IGameSetting,
  IPTLiveGame,
  IGameLimits
} from '@shared/interface';
import { TViewMode } from '@shared/type';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameInfoComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameInfoComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {TViewMode}
   * @memberof GameInfoComponent
   */
  private _viewMode: TViewMode = 'grid';

  /**
   *
   *
   * @readonly
   * @type {TViewMode}
   * @memberof GameInfoComponent
   */
  @Input()
  public set viewMode(viewMode: TViewMode) {
    this._viewMode = viewMode;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameInfoComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameInfoComponent
   */
  @Input()
  public set liveOption(liveOption: IPTLiveGame) {
    this._liveOption = liveOption;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameInfoComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @readonly
   * @type {TViewMode}
   * @memberof GameInfoComponent
   */
  public get viewMode(): TViewMode {
    return this._viewMode;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameInfoModalComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameInfoModalComponent
   */
  @Input()
  public set setting(setting: IGameSetting) {
    this._setting = setting;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameInfoModalComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameInfoComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameInfoComponent
   */
  @Input()
  public set game(game: IGame) {
    this._game = game;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameInfoComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {keyof IGameLimits}
   * @memberof GameInfoComponent
   */
  public set limit(limit: keyof IGameLimits) {
    this._gameSvc.setLimit(this.game, limit);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {keyof IGameLimits}
   * @memberof GameInfoComponent
   */
  public get limit(): keyof IGameLimits {
    return this._gameSvc.getLimit(this.game);
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameInfoComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof GameInfoComponent
   */
  public get currencySymbol(): string {
    return this._gameSvc.globalCurrencySymbol;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameInfoComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameInfoComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {GameService} _gameSvc
   * @memberof GameInfoComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameInfoComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.liveOption = this._gameSvc.pluckLiveOptionByCode(this.game);
    }

    this._subscription.add(
      this._gameSvc.limitSelector$
        .pipe(
          skipWhile(() => this.game === null),
          distinctUntilChanged()
        )
        .subscribe(() => this._changeDetectorRef.markForCheck())
    );
  }

  /**
   *
   *
   * @memberof GameInfoComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameInfoComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @returns {string}
   * @memberof GameInfoComponent
   */
  public getDetailsStyle(): string {
    if (this.viewMode === 'list') {
      return 'details--vertical';
    }

    return '';
  }

  /**
   *
   *
   * @returns {string}
   * @memberof GameInfoComponent
   */
  public getDetailsBackgroundStyle(): { [key: string]: string } {
    const isOnline: boolean = this.liveStatus === 'online';
    const picture: string = this.liveDealerPicture;
    if (this.isLiveDealerGame && isOnline && picture) {
      return {
        'background-image': `url(${picture})`
      };
    }

    return null;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof GameInfoComponent
   */
  public get liveDealerPicture(): string {
    if (this.isLiveDealerGame && _.has(this.liveOption, 'dealer.picture')) {
      return _.get(this.liveOption, 'dealer.picture');
    }

    return null;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof GameInfoComponent
   */
  public get liveDealerName(): string {
    if (this.isLiveDealerGame && _.has(this.liveOption, 'dealer.name')) {
      return _.get(this.liveOption, 'dealer.name');
    }

    return null;
  }

  /**
   *
   *
   * @returns {'online'|'offline'}
   * @memberof GameInfoComponent
   */
  public get liveStatus(): 'online' | 'offline' {
    if (this.isLiveDealerGame && _.has(this.liveOption, 'status')) {
      return _.get(this.liveOption, 'status');
    }

    return 'offline';
  }

  /**
   *
   *
   * @returns {'online'|'offline'}
   * @memberof GameInfoComponent
   */
  public get isDisabled(): boolean {
    return this.isLiveDealerGame && this.liveStatus === 'offline';
  }

  /**
   *
   *
   * @returns {number}
   * @memberof GameInfoComponent
   */
  public get stakeMin(): number {
    return this._gameSvc.getStakeMin(this.game, this.limit);
  }

  /**
   *
   *
   * @param {keyof IGameLimits} limit
   * @returns {number}
   * @memberof GameInfoComponent
   */
  public get stakeMax(): number {
    return this._gameSvc.getStakeMax(this.game, this.limit);
  }
}
