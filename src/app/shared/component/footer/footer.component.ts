import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IPlayer } from '@shared/interface';
import { AuthService } from '@shared/service';

/**
 *
 *
 * @export
 * @class FooterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @type {Observable<IPlayer>}
   * @memberof FooterComponent
   */
  public get player$(): Observable<IPlayer> {
    return this._authSvc.player$;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof FooterComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of FooterComponent.
   * @param {AuthService} _authSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof FooterComponent
   */
  public constructor(
    private _authSvc: AuthService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof FooterComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof FooterComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   */
  public ngAfterViewInit() {}
}
