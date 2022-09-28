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
import { IGame, IGameSetting, IGameMeta } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameThumbImageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-thumb-image',
  templateUrl: './game-thumb-image.component.html',
  styleUrls: ['./game-thumb-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameThumbImageComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameThumbImageComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameThumbImageComponent
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
   * @memberof GameThumbImageComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameThumbImageComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameThumbImageComponent
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
   * @memberof GameThumbImageComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameThumbImageComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameThumbImageComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameThumbImageComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameThumbImageComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
    }
  }

  /**
   *
   *
   * @memberof GameThumbImageComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameThumbImageComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameThumbImageComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @returns {string}
   * @memberof GameThumbImageComponent
   */
  public getSrc(): string {
    if (this.setting) {
      const metas: (keyof IGameMeta)[] = ['logo', 'poster', 'icon'];
      const filtered: any[] = metas.filter(
        (k: string) => this.setting.meta[k].exists
      );
      for (const key of filtered) {
        return this.setting.images[key];
      }
    }

    return '';
  }

  /**
   *
   *
   * @returns {string}
   * @memberof GameThumbImageComponent
   */
  public getImageStyle(): string {
    return `_image_${this.game.code}`;
  }
}
