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
import * as moment from 'moment';
import { Moment, MomentInput, Duration } from 'moment';
import { IGame, IGameSetting, IPTLiveGame } from '@shared/interface';
import { GameService, ClockService } from '@shared/service';
import { filter } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class GameLiveCountdownComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-live-countdown',
  templateUrl: './game-live-countdown.component.html',
  styleUrls: ['./game-live-countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLiveCountdownComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @private
   * @type {Moment}
   * @memberof GameLiveCountdownComponent
   */
  private _startAt: Moment = null;

  /**
   *
   *
   * @readonly
   * @type {Moment}
   * @memberof GameLiveCountdownComponent
   */
  public set startAt(startAt: Moment) {
    this._startAt = startAt;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {Moment}
   * @memberof GameLiveCountdownComponent
   */
  public get startAt(): Moment {
    return this._startAt;
  }

  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameLiveCountdownComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameLiveCountdownComponent
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
   * @memberof GameLiveCountdownComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameLiveCountdownComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameLiveCountdownComponent
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
   * @memberof GameLiveCountdownComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameLiveCountdownComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameLiveCountdownComponent
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
   * @memberof GameLiveCountdownComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {Duration}
   * @memberof GameLiveCountdownComponent
   */
  private _duration: Duration = null;

  /**
   *
   *
   * @readonly
   * @type {Duration}
   * @memberof GameLiveCountdownComponent
   */
  @Input()
  public set duration(duration: Duration) {
    this._duration = duration;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {Duration}
   * @memberof GameLiveCountdownComponent
   */
  public get duration(): Duration {
    return this._duration;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameLiveCountdownComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }

  /**
   *
   *
   * @private
   * @type {MomentInput}
   * @memberof GameLiveCountdownComponent
   */
  private _time: MomentInput = null;

  /**
   *
   *
   * @readonly
   * @type {MomentInput}
   * @memberof GameLiveCountdownComponent
   */
  public set time(time: MomentInput) {
    this._time = time;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {MomentInput}
   * @memberof GameLiveCountdownComponent
   */
  public get time(): MomentInput {
    return this._time;
  }
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameLiveCountdownComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameLiveCountdownComponent.
   * @param {ClockService} _clockSvc
   * @param {GameService} _gameSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameLiveCountdownComponent
   */
  public constructor(
    private _clockSvc: ClockService,
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameLiveCountdownComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.liveOption = this._gameSvc.pluckLiveOptionByCode(this.game);
      this.startAt = this._gameSvc.getLiveGameTableTimeAsMoment(this.game);
    }

    this._subscription.add(
      this._clockSvc.clock$
        .pipe(filter(() => moment.isMoment(this.startAt)))
        .subscribe((now: Moment) => {
          const startAt: Moment = this.startAt.clone();
          const diff = startAt.diff(now);
          const duration = moment.duration(diff, 'milliseconds');
          const seconds: number = duration.asSeconds();
          const hour: number = Math.trunc(seconds / 3600);
          const minute: number = Math.trunc((seconds - hour * 3600) / 60);
          const second: number = Math.trunc(
            seconds - hour * 3600 - minute * 60
          );
          this.time = moment()
            .clone()
            .set('hour', hour)
            .set('minute', minute)
            .set('second', second);
        })
    );
  }

  /**
   *
   *
   * @memberof GameLiveCountdownComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameLiveCountdownComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameLiveCountdownComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
