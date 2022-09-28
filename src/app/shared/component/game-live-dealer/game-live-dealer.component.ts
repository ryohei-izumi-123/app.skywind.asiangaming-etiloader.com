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
import * as _ from 'lodash';
import { IGame, IGameSetting, IPTLiveGame } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameLiveDealerComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-live-dealer',
  templateUrl: './game-live-dealer.component.html',
  styleUrls: ['./game-live-dealer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLiveDealerComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameLiveDealerComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameLiveDealerComponent
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
   * @memberof GameLiveDealerComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameLiveDealerComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameLiveDealerComponent
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
   * @memberof GameLiveDealerComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameLiveDealerComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameLiveDealerComponent
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
   * @memberof GameLiveDealerComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameLiveDealerComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameLiveDealerComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameLiveDealerComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {GameService} _gameSvc
   * @memberof GameLiveDealerComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameLiveDealerComponent
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
   * @memberof GameLiveDealerComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameLiveDealerComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @returns {string}
   * @memberof GameLiveDealerImageComponent
   */
  public get liveDealerName(): string {
    if (this.isLiveDealerGame && _.has(this.liveOption, 'dealer.name')) {
      return _.get(this.liveOption, 'dealer.name');
    }

    return null;
  }
}
