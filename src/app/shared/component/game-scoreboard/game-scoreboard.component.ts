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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  Subscription,
  interval as interval$,
  Observable,
  merge as merge$
} from 'rxjs';
import {
  map,
  skipWhile,
  concatMap,
  take,
  debounceTime,
  filter
} from 'rxjs/operators';
import { IGame, IGameSetting, IPTLiveGame } from '@shared/interface';
import { GameService, ElectronService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameScoreboardComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-scoreboard',
  templateUrl: './game-scoreboard.component.html',
  styleUrls: ['./game-scoreboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScoreboardComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameScoreboardComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameScoreboardComponent
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
   * @memberof GameScoreboardComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameScoreboardComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameScoreboardComponent
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
   * @memberof GameScoreboardComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameScoreboardComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameScoreboardComponent
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
   * @memberof GameScoreboardComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {SafeHtml}
   * @memberof GameScoreboardComponent
   */
  private _svg: SafeHtml = null;

  /**
   *
   *
   * @readonly
   * @type {SafeHtml}
   * @memberof GameScoreboardComponent
   */
  public set svg(svg: SafeHtml) {
    this._svg = svg;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {SafeHtml}
   * @memberof GameScoreboardComponent
   */
  public get svg(): SafeHtml {
    return this._svg;
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof GameScoreboardComponent
   */
  private _interval: number = 30000;

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameScoreboardComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameScoreboardComponent.
   * @param {ElectronService} _electronSvc
   * @param {GameService} _gameSvc
   * @param {DomSanitizer} _domSanitizer
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameScoreboardComponent
   */
  public constructor(
    private _electronSvc: ElectronService,
    private _gameSvc: GameService,
    private _domSanitizer: DomSanitizer,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameScoreboardComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      this.liveOption = this._gameSvc.pluckLiveOptionByCode(this.game);
      this._subscription.add(
        merge$(
          interval$(0).pipe(take(1)),
          interval$(this._interval),
          this._electronSvc.windowState$.pipe(
            filter((windowState: boolean) => windowState)
          )
        )
          .pipe(
            skipWhile(() => this.liveOption === null),
            debounceTime(1000),
            concatMap(() => this.load$())
          )
          .subscribe((svg: SafeHtml) => (this.svg = svg))
      );
    }
  }

  /**
   *
   *
   * @memberof GameScoreboardComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameScoreboardComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @returns {Subscription}
   * @memberof GameScoreboardComponent
   */
  public load$(): Observable<SafeHtml> {
    return this._gameSvc.getLiveGameScoreboard$(this.liveOption.id).pipe(
      map((svg: string) => this._domSanitizer.bypassSecurityTrustHtml(svg)),
      take(1)
    );
  }
}
