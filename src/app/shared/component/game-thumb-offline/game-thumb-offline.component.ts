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
  IGame,
  IGameSetting,
  IPTLiveGame,
  TGameFeatureLiveType
} from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameThumbOfflineComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-thumb-offline',
  templateUrl: './game-thumb-offline.component.html',
  styleUrls: ['./game-thumb-offline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameThumbOfflineComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameThumbOfflineComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameThumbOfflineComponent
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
   * @memberof GameThumbOfflineComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameThumbOfflineComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameThumbOfflineComponent
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
   * @memberof GameThumbOfflineComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameThumbOfflineComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameThumbOfflineComponent
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
   * @memberof GameThumbOfflineComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbOfflineComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbOfflineComponent
   */
  public get getLiveGameType(): TGameFeatureLiveType {
    return this._gameSvc.getLiveGameType(this.game);
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameThumbOfflineComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameThumbOfflineComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameThumbOfflineComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameThumbOfflineComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.liveOption = this._gameSvc.pluckLiveOptionByCode(this.game);
    }
  }

  /**
   *
   *
   * @memberof GameThumbOfflineComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameThumbOfflineComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameThumbOfflineComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
