import { environment } from '@env/environment';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  skipWhile,
  filter,
  distinctUntilChanged,
  take,
  withLatestFrom
} from 'rxjs/operators';
import * as _ from 'lodash';
import {
  IGame,
  IGameSetting,
  IGameGroupLimits,
  IGameLimits
} from '@shared/interface';
import { GameService } from '@shared/service';
import { TViewMode } from '@shared/type/view-mode';

/**
 *
 *
 * @export
 * @class GameThumbLimitsComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-thumb-limits',
  templateUrl: './game-thumb-limits.component.html',
  styleUrls: ['./game-thumb-limits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameThumbLimitsComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @private
   * @type {TViewMode}
   * @memberof GameThumbLimitsComponent
   */
  private _viewMode: TViewMode = 'grid';

  /**
   *
   *
   * @readonly
   * @type {TViewMode}
   * @memberof GameThumbLimitsComponent
   */
  @Input()
  public set viewMode(viewMode: TViewMode) {
    this._viewMode = viewMode;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {TViewMode}
   * @memberof GameThumbLimitsComponent
   */
  public get viewMode(): TViewMode {
    return this._viewMode;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameThumbLimitsComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameThumbLimitsComponent
   */
  public set setting(setting: IGameSetting) {
    this._setting = setting;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameThumbLimitsComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameThumbLimitsComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameThumbLimitsComponent
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
   * @memberof GameThumbLimitsComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {keyof IGameLimits}
   * @memberof GameThumbLimitsComponent
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
   * @memberof GameThumbLimitsComponent
   */
  public get limit(): keyof IGameLimits {
    return this._gameSvc.getLimit(this.game);
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof GameThumbLimitsComponent
   */
  private _showSelector: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbLimitsComponent
   */
  public set showSelector(showSelector: boolean) {
    this._showSelector = showSelector;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbLimitsComponent
   */
  public get showSelector(): boolean {
    return this._showSelector;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof GameThumbLimitsComponent
   */
  public get currencySymbol(): string {
    return this._gameSvc.globalCurrencySymbol;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbLimitsComponent
   */
  public get hasSameGameLimits(): boolean {
    return this._gameSvc.hasSameGameLimits(this.game);
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameThumbLimitsComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameThumbLimitsComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameThumbLimitsComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameThumbLimitsComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.limit = this._gameSvc.getLimit(this.game);
    }

    this._subscription.add(
      this._gameSvc.gameLimits$
        .pipe(
          skipWhile(
            (gameLimits: IGameGroupLimits[]) =>
              _.isEmpty(gameLimits) || _.size(gameLimits) === 0
          ),
          distinctUntilChanged(
            (a: IGameGroupLimits[], b: IGameGroupLimits[]) =>
              JSON.stringify(a) === JSON.stringify(b)
          )
        )
        .subscribe(() => this._changeDetectorRef.markForCheck())
    );

    this._subscription.add(
      this._gameSvc.limitSelector$
        .pipe(
          skipWhile(() => this.game === null),
          filter((game: IGame) => this.game.code !== _.get(game, 'code'))
        )
        .subscribe(() => (this.showSelector = false))
    );
  }

  /**
   *
   *
   * @memberof GameThumbLimitsComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameThumbLimitsComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameThumbLimitsComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof GameThumbLimitsComponent
   */
  public get stakeMin(): number {
    return this._gameSvc.getStakeMin(this.game, this.limit);
  }

  /**
   *
   *
   * @returns {number}
   * @memberof GameThumbLimitsComponent
   */
  public get stakeMax(): number {
    return this._gameSvc.getStakeMax(this.game, this.limit);
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameThumbLimitsComponent
   */
  public open($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this._gameSvc.limitSelector = this.game;
    this.showSelector = true;
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameThumbLimitsComponent
   */
  public close($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this._gameSvc.limitSelector = null;
    this.showSelector = false;
  }
}
