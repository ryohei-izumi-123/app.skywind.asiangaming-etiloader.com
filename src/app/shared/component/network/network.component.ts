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
 * @class NetworkComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof NetworkComponent
   */
  public get status$(): Observable<boolean> {
    return this._networkSvc.status$;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof NetworkComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of NetworkComponent.
   * @param {NetworkService} _networkSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof NetworkComponent
   */
  public constructor(
    private _networkSvc: NetworkService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof NetworkComponent
   */
  public ngOnInit() {
    this._subscription.add(this._networkSvc.status$.pipe().subscribe());
  }

  /**
   *
   *
   * @memberof NetworkComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
