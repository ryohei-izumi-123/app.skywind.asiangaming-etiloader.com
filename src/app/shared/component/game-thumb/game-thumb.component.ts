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
import { IGame, IGameSetting, IPTLiveGame } from '@shared/interface';
import { GameService, ModalService } from '@shared/service';
import { GameInfoModalComponent } from '@shared/component/game-info-modal/game-info-modal.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/**
 *
 *
 * @export
 * @class GameThumbComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-thumb',
  templateUrl: './game-thumb.component.html',
  styleUrls: ['./game-thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameThumbComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @private
   * @type {IPTLiveGame}
   * @memberof GameThumbComponent
   */
  private _liveOption: IPTLiveGame = null;

  /**
   *
   *
   * @readonly
   * @type {IPTLiveGame}
   * @memberof GameThumbComponent
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
   * @memberof GameThumbComponent
   */
  public get liveOption(): IPTLiveGame {
    return this._liveOption;
  }

  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof GameThumbComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof GameThumbComponent
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
   * @memberof GameThumbComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameThumbComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameThumbComponent
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
   * @memberof GameThumbComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbComponent
   */
  public get isLiveDealerGame(): boolean {
    return this._gameSvc.isLiveDealerGame(this.game);
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof GameThumbComponent
   */
  public get isLiveDealerGameOffline(): boolean {
    return this._gameSvc.isLiveDealerGameOffline(this.game);
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameThumbComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameThumbComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameThumbComponent
   */
  public constructor(
    private _modalSvc: ModalService,
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameThumbComponent
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
   * @memberof GameThumbComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameThumbComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameThumbComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {Event} $event
   * @memberof GameThumbComponent
   */
  public showInfo($event: Event): void {
    $event.stopImmediatePropagation();
    const modalRef$: NgbModalRef = this._modalSvc.open(
      'GameInfoModalComponent'
    );
    (<GameInfoModalComponent>modalRef$.componentInstance).game = this.game;
    (<GameInfoModalComponent>(
      modalRef$.componentInstance
    )).setting = this.setting;
  }

  /**
   *
   *
   * @returns {*}
   * @memberof GameThumbComponent
   */
  public getCaptionStyle(): { [key: string]: string } {
    if (this.isLiveDealerGameOffline) {
      return {
        cursor: 'default !important'
      };
    }

    return {
      cursor: 'pointer !important'
    };
  }
}
