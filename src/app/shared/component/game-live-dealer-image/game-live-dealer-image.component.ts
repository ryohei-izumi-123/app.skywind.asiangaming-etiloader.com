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
import { Subscription, interval as interval$, merge as merge$ } from 'rxjs';
import { map, skipWhile, take, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IGame, IGameSetting, IPTLiveGame } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameLiveDealerImageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-live-dealer-image',
  templateUrl: './game-live-dealer-image.component.html',
  styleUrls: ['./game-live-dealer-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLiveDealerImageComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameLiveDealerImageComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameLiveDealerImageComponent
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
   * @memberof GameLiveDealerImageComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameLiveDealerImageComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameLiveDealerImageComponent
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
   * @memberof GameLiveDealerImageComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameLiveDealerImageComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameLiveDealerImageComponent
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
   * @memberof GameLiveDealerImageComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof GameLiveDealerImageComponent
   */
  private _timestamp: number = moment().unix() * 1000;

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof GameLiveDealerImageComponent
   */
  public set timestamp(timestamp: number) {
    this._timestamp = timestamp;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof GameLiveDealerImageComponent
   */
  public get timestamp(): number {
    return this._timestamp;
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof GameLiveDealerImageComponent
   */
  private _interval: number = 300000;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameLiveDealerImageComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameLiveDealerImageComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameLiveDealerImageComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {GameService} _gameSvc
   * @memberof GameLiveDealerImageComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameLiveDealerImageComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.liveOption = this._gameSvc.pluckLiveOptionByCode(this.game);
      this._subscription.add(
        merge$(interval$(0).pipe(take(1)), interval$(this._interval))
          .pipe(
            skipWhile(() => this.liveOption === null),
            debounceTime(1000),
            map(() => moment().unix() * 1000)
          )
          .subscribe((timestamp: number) => (this.timestamp = timestamp))
      );
    }
  }

  /**
   *
   *
   * @memberof GameLiveDealerImageComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameLiveDealerImageComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @returns {string}
   * @memberof GameLiveDealerImageComponent
   */
  public get liveDealerPicture(): string {
    const isOnline: boolean = this.getLiveStatus() === 'online';
    const picture: string = this.getLiveDealerPicture();
    if (this.isLiveDealerGame && isOnline && picture) {
      return picture;
    }

    return null;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof GameLiveDealerImageComponent
   */
  public getLiveDealerPicture(): string {
    if (this.isLiveDealerGame && _.has(this.liveOption, 'dealer.picture')) {
      return _.get(this.liveOption, 'dealer.picture');
    }

    return null;
  }

  /**
   *
   *
   * @returns {'online'|'offline'}
   * @memberof GameLiveDealerImageComponent
   */
  public getLiveStatus(): 'online' | 'offline' {
    if (this.isLiveDealerGame && _.has(this.liveOption, 'status')) {
      return _.get(this.liveOption, 'status');
    }

    return 'offline';
  }
}
