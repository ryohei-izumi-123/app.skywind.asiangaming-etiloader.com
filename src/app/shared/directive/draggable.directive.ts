import {
  Directive,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, flatMap, takeUntil } from 'rxjs/operators';
import { IDraggablePosition } from '@shared/interface';

/**
 *
 *
 * @export
 * @class DraggableDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  /**
   * something like api
   *
   * @type {EventEmitter<IDraggablePosition>}
   * @memberof DraggableDirective
   */
  @Output()
  public draggableEvent: EventEmitter<IDraggablePosition> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {HTMLElement}
   * @memberof DraggableDirective
   */
  private _$dom: HTMLElement;

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseUp: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseDown: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseMove: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseDrag$: Observable<IDraggablePosition>;

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  private _mouseEventSubscription: Subscription;

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @memberof DraggableDirective
   */
  @HostListener('document:mouseup', ['$event'])
  public onMouseup($event: MouseEvent): void {
    if (!this.checkIsClickable($event)) {
      this.mouseUp.emit($event);
    }
  }

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @returns
   * @memberof DraggableDirective
   */
  @HostListener('mousedown', ['$event'])
  public onMousedown($event: MouseEvent): void {
    if (!this.checkIsClickable($event)) {
      this.mouseDown.emit($event);
      return $event.preventDefault();
    }
  }

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @memberof DraggableDirective
   */
  @HostListener('document:mousemove', ['$event'])
  public onMousemove($event: MouseEvent): void {
    if (!this.checkIsClickable($event)) {
      this.mouseMove.emit($event);
    }
  }

  /**
   *Creates an instance of DraggableDirective.
   * @param {ElementRef} _element
   * @memberof DraggableDirective
   */
  public constructor(public _element: ElementRef) {}

  /**
   *
   *
   * @private
   * @param {(UIEvent | MouseEvent)} $event
   * @returns {boolean}
   * @memberof DraggableDirective
   */
  private checkIsClickable($event: UIEvent | MouseEvent): boolean {
    return (
      false ||
      $event.target instanceof HTMLButtonElement ||
      $event.target instanceof HTMLFormElement ||
      $event.target instanceof HTMLAnchorElement ||
      $event.target instanceof HTMLInputElement ||
      $event.target instanceof HTMLTextAreaElement ||
      $event.target instanceof HTMLSelectElement ||
      $event.target instanceof HTMLLinkElement ||
      $event.target instanceof HTMLFormControlsCollection
    );
  }

  /**
   *
   *
   * @memberof DraggableDirective
   */
  public ngOnInit() {
    this._$dom = this._element.nativeElement;

    const mapOperator = ($event: MouseEvent) =>
      ({
        top: $event.clientY - this._$dom.getBoundingClientRect().top,
        left: $event.clientX - this._$dom.getBoundingClientRect().left
      } as IDraggablePosition);

    const flatMapOperator = (offset: IDraggablePosition) =>
      this.mouseMove.pipe(
        map(
          ($event: MouseEvent) =>
            ({
              top: $event.clientY - offset.top,
              left: $event.clientX - offset.left
            } as IDraggablePosition)
        )
      );

    this.mouseDrag$ = this.mouseDown.pipe(
      map(($event: MouseEvent) => mapOperator($event)),
      flatMap((offset: IDraggablePosition) =>
        flatMapOperator(offset).pipe(takeUntil(this.mouseUp))
      )
    );
    this._mouseEventSubscription = this.mouseDrag$.subscribe(
      (position: IDraggablePosition) => this.draggableEvent.emit(position)
    );
  }

  /**
   *
   *
   * @memberof DraggableDirective
   */
  public ngOnDestroy() {
    this.mouseDrag$.subscribe({ complete: null });
    this._mouseEventSubscription.unsubscribe();
  }
}
