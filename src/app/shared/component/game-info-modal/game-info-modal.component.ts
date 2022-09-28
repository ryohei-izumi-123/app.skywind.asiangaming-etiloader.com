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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TModalComponent } from '@shared/type';
import { IGame, IGameSetting } from '@shared/interface';
import { GameService } from '@shared/service/game.service';

/**
 *
 *
 * @export
 * @class GameInfoModalComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-info-modal',
  templateUrl: './game-info-modal.component.html',
  styleUrls: ['./game-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameInfoModalComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @type {TModalComponent}
   * @memberof GameInfoModalComponent
   */
  public name: TModalComponent = 'CommonModalComponent';

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
   * @memberof GameInfoModalComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameInfoModalComponent
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
   * @memberof GameInfoModalComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameInfoModalComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameInfoModalComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {NgbActiveModal} _ngbActiveModal
   * @memberof GameInfoModalComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _ngbActiveModal: NgbActiveModal,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameInfoModalComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
    }
  }

  /**
   *
   *
   * @memberof GameInfoModalComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameInfoModalComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof GameInfoModalComponent
   */
  public close($event: MouseEvent): void {
    return this._ngbActiveModal.close(true);
  }
}
