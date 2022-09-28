import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NetworkService } from '@shared/service';

/**
 *
 *
 * @export
 * @class OfflineMessageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-offline-message',
  templateUrl: './offline-message.component.html',
  styleUrls: ['./offline-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineMessageComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof OfflineMessageComponent
   */
  public get status$(): Observable<boolean> {
    return this._networkSvc.status$;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof OfflineMessageComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of OfflineMessageComponent.
   * @param {NetworkService} _networkSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OfflineMessageComponent
   */
  public constructor(
    private _networkSvc: NetworkService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof OfflineMessageComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof OfflineMessageComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
