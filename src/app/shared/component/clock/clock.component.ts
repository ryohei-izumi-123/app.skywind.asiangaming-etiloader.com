import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Moment, MomentInput } from 'moment';
import { ClockService } from '@shared/service';

/**
 *
 *
 * @export
 * @class ClockComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {MomentInput}
   * @memberof ClockComponent
   */
  private _time: MomentInput = null;

  /**
   *
   *
   * @readonly
   * @type {MomentInput}
   * @memberof ClockComponent
   */
  public set time(time: MomentInput) {
    this._time = time;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {MomentInput}
   * @memberof ClockComponent
   */
  public get time(): MomentInput {
    return this._time;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof ClockComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of ClockComponent.
   * @param {ClockService} _clockSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ClockComponent
   */
  public constructor(
    private _clockSvc: ClockService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof ClockComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._clockSvc.clock$.subscribe((time: Moment) => (this.time = time))
    );
  }

  /**
   *
   *
   * @memberof ClockComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
