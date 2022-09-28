import {
  ElementRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  delay,
  takeUntil,
  skipUntil,
  throttleTime,
  take,
  map,
  filter
} from 'rxjs/operators';
import * as _ from 'lodash';
import { IGame, IDraggablePosition } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class GameTooltipComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-game-tooltip',
  templateUrl: './game-tooltip.component.html',
  styleUrls: ['./game-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTooltipComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   * @description delay for start to show tooltip.
   * @private
   * @type {number}
   * @memberof GameTooltipComponent
   */
  private _delay: number = 1000;

  /**
   *
   * @description debounce time for performance subscriber
   * @private
   * @type {number}
   * @memberof GameTooltipComponent
   */
  private _duration: number = 250;

  /**
   *
   * @description adjustment mouse pointer postion
   * @private
   * @type {number}
   * @memberof GameTooltipComponent
   */
  private _adjustment: number = 64;

  /**
   *
   *
   * @private
   * @type {IDraggablePosition}
   * @memberof GameTooltipComponent
   */
  private _offset: IDraggablePosition = {
    top: 0,
    left: 0
  };

  /**
   *
   * @param {IDraggablePosition} offset
   * @memberof GameTooltipComponent
   */
  public set offset(offset: IDraggablePosition) {
    this._offset = offset;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IDraggablePosition}
   * @memberof GameTooltipComponent
   */
  public get offset(): IDraggablePosition {
    return this._offset;
  }

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof GameTooltipComponent
   */
  private _mouseMove$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof GameTooltipComponent
   */
  private _mouseEnter$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof GameTooltipComponent
   */
  private _mouseLeave$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof GameTooltipComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof GameTooltipComponent
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
   * @memberof GameTooltipComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof GameTooltipComponent
   */
  public get currencySymbol(): string {
    return this._gameSvc.globalCurrencySymbol;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof GameTooltipComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of GameTooltipComponent.
   * @param {GameService} _gameSvc
   * @param {ElementRef} _element
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof GameTooltipComponent
   */
  public constructor(
    private _gameSvc: GameService,
    public _element: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof GameTooltipComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._mouseEnter$
        .pipe(
          map(($event: MouseEvent) => this.getOffsetFromEvent($event)),
          take(1)
        )
        .subscribe((offset: IDraggablePosition) => (this.offset = offset))
    );

    this._subscription.add(
      this._mouseMove$
        .pipe(
          skipUntil(this._mouseEnter$.pipe(delay(this._delay))),
          takeUntil(this._mouseLeave$),
          throttleTime(this._duration),
          map(($event: MouseEvent) => this.getOffsetFromEvent($event)),
          filter(
            (offset: IDraggablePosition) =>
              offset.top > this._adjustment && offset.left > this._adjustment
          )
        )
        .subscribe((offset: IDraggablePosition) => (this.offset = offset))
    );
  }

  /**
   *
   *
   * @private
   * @param {MouseEvent} $event
   * @returns {IDraggablePosition}
   * @memberof GameTooltipComponent
   */
  private getOffsetFromEvent($event: MouseEvent): IDraggablePosition {
    return <IDraggablePosition>{
      top: $event.clientY - this._adjustment,
      left: $event.clientX - this._adjustment
    };
  }

  /**
   *
   *
   * @memberof GameTooltipComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof GameTooltipComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof GameTooltipComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameTooltipComponent
   */
  public hide($event: MouseEvent): any {
    this._mouseLeave$.emit($event);
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameTooltipComponent
   */
  public show($event: MouseEvent): any {
    this._mouseEnter$.emit($event);
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof GameTooltipComponent
   */
  public move($event: MouseEvent): any {
    this._mouseMove$.emit($event);
  }

  /**
   *
   *
   * @returns {{ [T in keyof IDraggablePosition]: string }}
   * @memberof GameTooltipComponent
   */
  public getTooltipStyle(): { [T in keyof IDraggablePosition]: string } {
    return {
      top: `${this.offset.top}px`,
      left: `${this.offset.left}px`
    };
  }

  /**
   *
   *
   * @returns {number}
   * @memberof GameTooltipComponent
   */
  public get maxWin(): number {
    return this._gameSvc.getMaxWin(this.game);
  }
}
