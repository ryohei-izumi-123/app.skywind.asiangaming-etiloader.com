import {
  ViewChild,
  ElementRef,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { Router, NavigationStart, Event as Event$ } from '@angular/router';
import {
  EMPTY as EMPTY$,
  from as fromPromise,
  of as of$,
  merge as merge$,
  fromEvent as fromEvent$,
  Subscription,
  Observable
} from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  finalize,
  filter,
  map,
  throttleTime,
  mergeMap,
  flatMap,
  skipWhile,
  concatMap,
  catchError
} from 'rxjs/operators';
import * as _ from 'lodash';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  ILayoutSize,
  IViewModel,
  IGame,
  IGameSortOrder,
  IGameCategory,
  IGameCategoryItem,
  INotification
} from '@shared/interface';
import {
  TLayoutSize,
  TViewMode,
  TGameSortOrder,
  TModalComponent
} from '@shared/type';
import {
  UiService,
  GameService,
  ModalService,
  NotificationService
} from '@shared/service';
import { NotificationModalComponent } from '@shared/component/notification-modal/notification-modal.component';

/**
 *
 *
 * @export
 * @class LobbyComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {ElementRef}
   * @memberof LobbyComponent
   */
  @ViewChild('content', { static: false }) public content: ElementRef;

  /**
   *
   *
   * @readonly
   * @type {IGameCategory}
   * @memberof LobbyComponent
   */
  public get gameCategory(): IGameCategory {
    return this._gameSvc.category;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof LobbyComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof LobbyComponent
   */
  public set game(game: IGame) {
    this._game = game;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof LobbyComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {IGame[]}
   * @memberof LobbyComponent
   */
  private _games: IGame[] = [];

  /**
   *
   *
   * @readonly
   * @type {IGame[]}
   * @memberof LobbyComponent
   */
  public set games(games: IGame[]) {
    this._games = games;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGame[]}
   * @memberof LobbyComponent
   */
  public get games(): IGame[] {
    return this._games;
  }

  /**
   *
   *
   * @private
   * @type {(keyof IGameSortOrder)[]}
   * @memberof LobbyComponent
   */
  private _gameSorts: (keyof IGameSortOrder)[] = ['title', 'type', 'maxWin'];

  /**
   *
   *
   * @readonly
   * @type {(keyof IGameSortOrder)[]}
   * @memberof LobbyComponent
   */
  public get gameSorts(): (keyof IGameSortOrder)[] {
    return this._gameSorts;
  }

  /**
   *
   *
   * @readonly
   * @type {TGameSortOrder}
   * @memberof LobbyComponent
   */
  public set gameSort(sort: TGameSortOrder) {
    this._gameSvc.sort = sort;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {TGameSortOrder}
   * @memberof LobbyComponent
   */
  public get gameSort(): TGameSortOrder {
    return this._gameSvc.sort;
  }

  /**
   *
   *
   * @private
   * @type {(keyof IViewModel)[]}
   * @memberof LobbyComponent
   */
  private _viewModes: (keyof IViewModel)[] = ['grid', 'list'];

  /**
   *
   *
   * @readonly
   * @type {(keyof IViewModel)[]}
   * @memberof LobbyComponent
   */
  public get viewModes(): (keyof IViewModel)[] {
    return this._viewModes;
  }

  /**
   *
   *
   * @private
   * @type {TViewMode}
   * @memberof LobbyComponent
   */
  private _viewMode: TViewMode = 'grid';

  /**
   *
   *
   * @readonly
   * @type {TViewMode}
   * @memberof LobbyComponent
   */
  public set viewMode(mode: TViewMode) {
    this._viewMode = mode;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {TViewMode}
   * @memberof LobbyComponent
   */
  public get viewMode(): TViewMode {
    return this._viewMode;
  }

  /**
   *
   *
   * @private
   * @type {(keyof ILayoutSize)[]}
   * @memberof LobbyComponent
   */
  private _layoutSizes: (keyof ILayoutSize)[] = ['small', 'medium', 'large'];

  /**
   *
   *
   * @readonly
   * @type {(keyof ILayoutSize)[]}
   * @memberof LobbyComponent
   */
  public get layoutSizes(): (keyof ILayoutSize)[] {
    return this._layoutSizes;
  }

  /**
   *
   *
   * @private
   * @type {TLayoutSize}
   * @memberof LobbyComponent
   */
  private _layoutSize: TLayoutSize = 'small';

  /**
   *
   *
   * @readonly
   * @type {TLayoutSize}
   * @memberof LobbyComponent
   */
  public set layoutSize(size: TLayoutSize) {
    this._layoutSize = size;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {TLayoutSize}
   * @memberof LobbyComponent
   */
  public get layoutSize(): TLayoutSize {
    return this._layoutSize;
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof LobbyComponent
   */
  private _showGameSortMenu: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof LobbyComponent
   */
  public set showGameSortMenu(showGameSortMenu: boolean) {
    this._showGameSortMenu = showGameSortMenu;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof LobbyComponent
   */
  public get showGameSortMenu(): boolean {
    return this._showGameSortMenu;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof LobbyComponent
   */
  public get isAsideOpen(): boolean {
    return this._uiSvc.isAsideOpen;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof LobbyComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of LobbyComponent.
   * @param {NotificationService} _notificationSvc
   * @param {ModalService} _modalSvc
   * @param {GameService} _gameSvc
   * @param {UiService} _uiSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LobbyComponent
   */
  public constructor(
    private _notificationSvc: NotificationService,
    private _modalSvc: ModalService,
    private _gameSvc: GameService,
    private _uiSvc: UiService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof LobbyComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._gameSvc.games$
        .pipe(filter((games: IGame[]) => _.isArray(games)))
        .subscribe((games: IGame[]) => {
          this.games = games.filter((game: IGame) => {
            const isNormal: boolean = _.get(game, 'status') === 'normal';
            if (this._gameSvc.isLiveDealerGame(game)) {
              const isOnline: boolean =
                _.get(this._gameSvc.pluckLiveOptionByCode(game), 'status') ===
                'online';
              return isNormal && isOnline;
            }

            return isNormal;
          });
        })
    );

    this._subscription.add(
      this._notificationSvc.notifications$
        .pipe(
          skipWhile(() => this._modalSvc.hasOpenModal),
          flatMap((notifications: INotification[]) => notifications),
          concatMap((notification: INotification) =>
            this.openNotificationModal$(notification)
          ),
          debounceTime(100)
        )
        .subscribe()
    );

    this._subscription.add(
      this._router.events
        .pipe(
          debounceTime(100),
          filter((event: Event$) => event instanceof NavigationStart),
          finalize(() => this._modalSvc.dismissAll())
        )
        .subscribe((event: Event$) => event)
    );

    this._subscription.add(
      of$(false)
        .pipe(
          mergeMap(() =>
            merge$(
              this._gameSvc.category$.pipe(
                distinctUntilChanged(),
                map(() => true)
              ),
              this._gameSvc.filter$.pipe(
                distinctUntilChanged(),
                map(() => true)
              ),
              this._gameSvc.sort$.pipe(
                distinctUntilChanged(),
                map(() => true)
              )
            )
          )
        )
        .pipe(
          skipWhile((changed: boolean) => !!!changed),
          map(() => this.getFilteredGames())
        )
        .subscribe((games: IGame[]) => (this._gameSvc.games = games))
    );
  }

  /**
   *
   *
   * @memberof LobbyComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof LobbyComponent
   */
  public ngAfterViewInit() {
    this._subscription.add(
      fromEvent$(<HTMLDivElement>this.content.nativeElement, 'scroll')
        .pipe(throttleTime(250))
        .subscribe(($event: UIEvent) => (this._uiSvc.scroll = $event))
    );
  }

  /**
   *
   *
   * @param {(TGameSortOrder)} size
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getGameSortStyle(sort: TGameSortOrder): string {
    return this.gameSort === sort ? 'active bo-highlight-color' : '';
  }

  /**
   *
   *
   * @param {TLayoutSize} size
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getLayoutSizeStyle(size: TLayoutSize): string {
    return this.layoutSize === size
      ? 'btn--active bo-highlight-bg'
      : 'btn--inactive bo-sub-btn-bg';
  }

  /**
   *
   * @param {IGame} game
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getGameVertItemStyle(game: IGame): string {
    return `games-vert__item bo-bg-main bo-border-color`;
  }

  /**
   *
   * @param {IGame} game
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getGameItemStyle(game: IGame): string {
    return `game__item--${this.layoutSize}`;
  }

  /**
   *
   *
   * @param {(TViewMode)} size
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getViewModeStyle(mode: TViewMode): string {
    return this.viewMode === mode ? 'bo-highlight-color' : '';
  }

  /**
   *
   *
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getAsideStyle(): string {
    if (this._uiSvc.isAsideOpen) {
      return 'open';
    }

    return '';
  }

  /**
   *
   *
   * @returns {string}
   * @memberof LobbyComponent
   */
  public getOverlayStyle(): string {
    if (this._uiSvc.isAsideOpen) {
      return 'overlay__fade--active';
    }

    return '';
  }

  /**
   *
   *
   * @param {Event} $event
   * @memberof LobbyComponent
   */
  public closeOverlay($event: Event): void {
    this._uiSvc.isAsideOpen = !this._uiSvc.isAsideOpen;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   * @param {MouseEvent} $event
   * @param {IGame} game
   * @memberof LobbyComponent
   */
  public openGameInfo($event: MouseEvent, game: IGame): void {
    $event.stopImmediatePropagation();
    const isOpened: boolean =
      !_.isEmpty(this.game) && this.game.code === game.code;
    this.game = isOpened ? null : game;
  }

  /**
   *
   *
   * @private
   * @returns {IGame[]}
   * @memberof LobbyComponent
   */
  private getFilteredGames(): IGame[] {
    return this._gameSvc.allGames
      .filter((game: IGame) => {
        const lower: (v: string) => string = (v: string) =>
          v ? String(v).toLowerCase() : '';
        const value: string = lower(this._gameSvc.filter);
        const category: IGameCategory = this._gameSvc.category;
        const textMatched: boolean = value
          ? lower(game.code).includes(value) ||
            lower(game.title).includes(value)
          : true;
        const categoryMatched: boolean = Array.from(category.items)
          .map((items: IGameCategoryItem) => items.id)
          .some((gameCode: string) => lower(gameCode) === lower(game.code));

        return textMatched && categoryMatched;
      })
      .sort((a: IGame, b: IGame) => {
        const sort: TGameSortOrder = this.gameSort;
        if (sort === 'title') {
          const aTitle: string = a.title;
          const bTitle: string = b.title;
          if (aTitle < bTitle) {
            return -1;
          }

          if (aTitle > bTitle) {
            return 1;
          }

          return 0;
        }

        if (sort === 'maxWin') {
          const aMax: number = this._gameSvc.getMaxWin(a);
          const bMax: number = this._gameSvc.getMaxWin(b);
          if (aMax < bMax) {
            return 1;
          }

          if (aMax > bMax) {
            return -1;
          }

          return 0;
        }

        if (sort === 'type') {
          const aType: string = a.type;
          const bType: string = b.type;
          if (aType < bType) {
            return -1;
          }

          if (aType > bType) {
            return 1;
          }

          return 0;
        }

        return 0;
      });
  }

  /**
   *
   *
   * @private
   * @param {INotification} [notification]
   * @returns {Observable<any>}
   * @memberof LobbyComponent
   */
  private openNotificationModal$(
    notification?: INotification
  ): Observable<any> {
    this._modalSvc.dismissAll();
    const name: TModalComponent = 'NotificationModalComponent';
    const modalRef$: NgbModalRef = this._modalSvc.open(name);
    if (notification) {
      (<NotificationModalComponent>(
        modalRef$.componentInstance
      )).notification = notification;
    }

    return fromPromise(modalRef$.result).pipe(catchError(() => EMPTY$));
  }
}
