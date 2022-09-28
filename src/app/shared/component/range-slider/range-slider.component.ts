import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';

/**
 *
 *
 * @export
 * @class RangeSliderComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeSliderComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   *
   *
   * @public
   * @type {number}
   * @memberof RangeSliderComponent
   */
  public min: number = 0;

  /**
   *
   *
   * @public
   * @type {number}
   * @memberof RangeSliderComponent
   */
  public max: number = 100;

  /**
   *
   *
   * @public
   * @type {number}
   * @memberof RangeSliderComponent
   */
  public step: number = 10;

  /**
   *
   *
   * @type {ElementRef}
   * @memberof RangeSliderComponent
   */
  @ViewChild('input', { static: false })
  public input: ElementRef;

  /**
   *
   *
   * @type {EventEmitter<number>}
   * @memberof RangeSliderComponent
   */
  @Output()
  public valueChanges$: EventEmitter<number> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof RangeSliderComponent
   */
  private _range: number = 0;

  /**
   *
   *
   * @type {number}
   * @memberof RangeSliderComponent
   */
  public get range(): number {
    return this._range;
  }

  /**
   *
   *
   * @memberof RangeSliderComponent
   */
  @Input()
  public set range(range: number) {
    this._range = range;
    if (this._range > this.max) {
      this._range = this.max;
    }

    if (this._range < this.min) {
      this._range = this.min;
    }

    this.valueChanges$.emit(this.range);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof RangeSliderComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of RangeSliderComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof RangeSliderComponent
   */
  public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   *
   *
   * @memberof RangeSliderComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof RangeSliderComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof RangeSliderComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof RangeSliderComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @returns {*}
   * @memberof RangeSliderComponent
   */
  public getProgressStyle(): { [key: string]: string } {
    return {
      width: `${this.range + 1}%`
    };
  }
}
