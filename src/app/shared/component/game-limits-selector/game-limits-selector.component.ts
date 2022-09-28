import { environment } from '@env/environment';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { IGame, IGameSetting, IGameLimits } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameLimitsSelectorComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-limits-selector',
  templateUrl: './game-limits-selector.component.html',
  styleUrls: ['./game-limits-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLimitsSelectorComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof GameLimitsSelectorComponent
   */
  @Output()
  public closeEvent$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameLimitsSelectorComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameLimitsSelectorComponent
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
   * @memberof GameLimitsSelectorComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameLimitsSelectorComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameLimitsSelectorComponent
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
   * @memberof GameLimitsSelectorComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameLimitsSelectorComponent
   */
  private _limits: (keyof IGameLimits)[] = [];

  /**
   *
   *
   * @readonly
   * @type {(keyof IGameLimits)[]}
   * @memberof GameLimitsSelectorComponent
   */
  public set limits(limits: (keyof IGameLimits)[]) {
    this._limits = limits;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {(keyof IGameLimits)[]}
   * @memberof GameLimitsSelectorComponent
   */
  public get limits(): (keyof IGameLimits)[] {
    return this._limits;
  }

  /**
   *
   *
   * @readonly
   * @type {keyof IGameLimits}
   * @memberof GameLimitsSelectorComponent
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
   * @memberof GameLimitsSelectorComponent
   */
  public get limit(): keyof IGameLimits {
    return this._gameSvc.getLimit(this.game);
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof GameLimitsSelectorComponent
   */
  public get currencySymbol(): string {
    return this._gameSvc.globalCurrencySymbol;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameLimitsSelectorComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameLimitsSelectorComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameLimitsSelectorComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameLimitsSelectorComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.limit = this._gameSvc.getLimit(this.game);
      this.limits = <(keyof IGameLimits)[]>(
        _.keys(this._gameSvc.getGameLimits(this.game))
      );
    }
  }

  /**
   *
   *
   * @memberof GameLimitsSelectorComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameLimitsSelectorComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameLimitsSelectorComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {keyof IGameLimits} limit
   * @returns {number}
   * @memberof GameLimitsSelectorComponent
   */
  public getStakeMin(limit: keyof IGameLimits): number {
    return this._gameSvc.getStakeMin(this.game, limit);
  }

  /**
   *
   *
   * @param {keyof IGameLimits} limit
   * @returns {number}
   * @memberof GameLimitsSelectorComponent
   */
  public getStakeMax(limit: keyof IGameLimits): number {
    return this._gameSvc.getStakeMax(this.game, limit);
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameLimitsSelectorComponent
   */
  public click($event: MouseEvent, limit: keyof IGameLimits): void {
    $event.stopImmediatePropagation();
    this.limit = limit;
    this.closeEvent$.emit($event);
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameLimitsSelectorComponent
   */
  public close($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    this.closeEvent$.emit($event);
  }
}
