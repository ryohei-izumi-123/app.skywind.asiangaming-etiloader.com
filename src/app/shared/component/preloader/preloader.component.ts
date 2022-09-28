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
 * @class PreloaderComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreloaderComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof PreloaderComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of PreloaderComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof PreloaderComponent
   */
  public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   *
   *
   * @memberof PreloaderComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof PreloaderComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
