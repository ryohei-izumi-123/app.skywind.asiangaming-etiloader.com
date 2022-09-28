import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import {
  Subscription,
  EMPTY as EMPTY$,
  interval as interval$,
  of as of$
} from 'rxjs';
import { take, catchError, finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import {
  LoggerService,
  GameService,
  ElectronService,
  SoundService,
  ModalService
} from '@shared/service';
import { UrlParser } from '@shared/class';
import {
  IGame,
  IGameUrl,
  IGameLimits,
  IGameRequest,
  IUrlSchema
} from '@shared/interface';

/**
 *
 *
 * @export
 * @class PlayGameDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[playGame]'
})
export class PlayGameDirective implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof PlayGameDirective
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof PlayGameDirective
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
   * @memberof PlayGameDirective
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof PlayGameDirective
   */
  private _isBusy: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof PlayGameDirective
   */
  public set isBusy(isBusy: boolean) {
    this._isBusy = isBusy;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof PlayGameDirective
   */
  public get isBusy(): boolean {
    return this._isBusy;
  }

  /**
   *
   *
   * @private
   * @type {IGameRequest}
   * @memberof PlayGameDirective
   */
  private _param: IGameRequest = null;

  /**
   *
   *
   * @readonly
   * @type {IGameRequest}
   * @memberof PlayGameDirective
   */
  public set param(param: IGameRequest) {
    this._param = param;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGameRequest}
   * @memberof PlayGameDirective
   */
  public get param(): IGameRequest {
    return this._param;
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof PlayGameDirective
   */
  private _interval: number = 5000;

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof PlayGameDirective
   */
  private _subscription: Subscription = new Subscription();

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @memberof PlayGameDirective
   */
  @HostListener('click', ['$event'])
  public onClick($event: MouseEvent): Subscription {
    if (!_.isNull(this.param)) {
      return this._subscription.add(
        of$(this.param)
          .pipe(take(1))
          .subscribe((param: IGameRequest) => this.sendRequest(param))
      );
    }

    if (!this.isBusy) {
      this.isBusy = true;
      return this._subscription.add(
        this._gameSvc
          .getPlayerGameUrl$(this.game)
          .pipe(
            finalize(() => (this.isBusy = false)),
            catchError(() => {
              this._electronSvc.sendRequestShowDialog({
                message: this._translateSvc.instant('cannotOpenGame')
              });
              return EMPTY$;
            }),
            take(1)
          )
          .subscribe((result: IGameUrl) => {
            if (_.has(result, 'url') && !_.isEmpty(result.url)) {
              const param: IGameRequest = {
                url: this.appendLimitParams(_.get(result, 'url')),
                gameCode: this.game.code,
                title: this.game.title
              };

              return this.sendRequest(param);
            }
          })
      );
    }

    this.isBusy = false;
    return this._subscription.add(EMPTY$.subscribe());
  }

  /**
   *
   *
   * @private
   * @param {IGameRequest} param
   * @returns {void}
   * @memberof PlayGameDirective
   */
  private sendRequest(param: IGameRequest): void {
    if (!_.isNull(param)) {
      this.param = param;
      this._electronSvc.sendRequestOpenGame(<IGameRequest>(
        _.assign(param, this._soundSvc.optionState)
      ));

      return this._modalSvc.dismissAll();
    }
  }

  /**
   *Creates an instance of PlayGameDirective.
   * @param {ModalService} _modalSvc
   * @param {ElectronService} _electronSvc
   * @param {LoggerService} _loggerSvc
   * @param {GameService} _gameSvc
   * @param {SoundService} _soundSvc
   * @param {TranslateService} _translateSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof PlayGameDirective
   */
  public constructor(
    private _modalSvc: ModalService,
    private _electronSvc: ElectronService,
    private _loggerSvc: LoggerService,
    private _gameSvc: GameService,
    private _soundSvc: SoundService,
    private _translateSvc: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @private
   * @param {string} original
   * @returns {string}
   * @memberof PlayGameDirective
   */
  private appendLimitParams(original: string): string {
    let url: string = original;

    try {
      const urlSchema: IUrlSchema = UrlParser.parse(original);
      const { protocol, hostname, pathname, hash, query } = urlSchema;
      const params: URLSearchParams = new URLSearchParams();
      const isLive: boolean = this._gameSvc.isLiveDealerGame(this.game);
      const limit: keyof IGameLimits = isLive
        ? this._gameSvc.getLimit(this.game)
        : null;
      if (limit) {
        params.append('limit', limit);
        _.keys(query).map((k: string) => params.append(k, _.get(query, k)));
        url = `${protocol}//${hostname}${pathname}${hash}?${params.toString()}`;
      }
    } catch (error) {
      this._loggerSvc.error(error);
    } finally {
      return url;
    }
  }

  /**
   *
   *
   * @memberof PlayGameDirective
   */
  public ngOnInit() {
    this._subscription.add(
      interval$(this._interval).subscribe(() => (this.param = null))
    );
  }

  /**
   *
   *
   * @memberof PlayGameDirective
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof PlayGameDirective
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
