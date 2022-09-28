import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';

/**
 *
 *
 * @export
 * @class PageNotFoundComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof PageNotFoundComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of PageNotFoundComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof PageNotFoundComponent
   */
  public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   *
   *
   * @memberof PageNotFoundComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof PageNotFoundComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
