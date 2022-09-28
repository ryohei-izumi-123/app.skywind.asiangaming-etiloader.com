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
import { AuthService, ModalService, ElectronService } from '@shared/service';

/**
 *
 *
 * @export
 * @class HeaderComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @type {Observable<IPlayer>}
   * @memberof HeaderComponent
   */
  public get player$(): Observable<IPlayer> {
    return this._authSvc.player$;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof HeaderComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of HeaderComponent.
   * @param {ElectronService} _electronSvc
   * @param {ModalService} _modalSvc
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof HeaderComponent
   */
  public constructor(
    private _electronSvc: ElectronService,
    private _modalSvc: ModalService,
    private _authSvc: AuthService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof HeaderComponent
   */
  public openSettingModal($event: MouseEvent): void {
    this._modalSvc.open('SettingModalComponent');
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof HeaderComponent
   */
  public toggleFullscreen($event: MouseEvent): void {
    this._electronSvc.sendRequestFullscreen();
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof HeaderComponent
   */
  public syncPlayer($event: MouseEvent): void {
    this._authSvc.trigger$.emit(true);
  }
}
