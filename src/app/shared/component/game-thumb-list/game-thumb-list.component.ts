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
import * as _ from 'lodash';
import { IGame, IGameSetting } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameThumbListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-thumb-list',
  templateUrl: './game-thumb-list.component.html',
  styleUrls: ['./game-thumb-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameThumbListComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameThumbListComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameThumbListComponent
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
   * @memberof GameThumbListComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameThumbListComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameThumbListComponent
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
   * @memberof GameThumbListComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbListComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameThumbListComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameThumbListComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameThumbListComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameThumbListComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
    }
  }

  /**
   *
   *
   * @memberof GameThumbListComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameThumbListComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameThumbListComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
