import {
  Input,
  OnChanges,
  SimpleChanges,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription, EMPTY as EMPTY$ } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TModalComponent } from '@shared/type';
import { INotification } from '@shared/interface/notification';
import { NotificationService } from '@shared/service/notification.service';
import { take, catchError, finalize } from 'rxjs/operators';
/**
 *
 *
 * @export
 * @class NotificationModalComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationModalComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @type {TModalComponent}
   * @memberof SettingModalComponent
   */
  public name: TModalComponent = 'CommonModalComponent';

  /**
   *
   *
   * @private
   * @type {INotification}
   * @memberof NotificationModalComponent
   */
  private _notification: INotification = null;

  /**
   *
   *
   * @private
   * @type {INotification}
   * @memberof NotificationModalComponent
   */
  public get notification(): INotification {
    return this._notification;
  }

  /**
   *
   *
   * @private
   * @type {INotification}
   * @memberof NotificationModalComponent
   */
  @Input()
  public set notification(notification: INotification) {
    this._notification = notification;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof NotificationModalComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of NotificationModalComponent.
   * @param {NotificationService} _notificationSvc
   * @param {NgbActiveModal} _ngbActiveModal
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof NotificationModalComponent
   */
  public constructor(
    private _notificationSvc: NotificationService,
    private _ngbActiveModal: NgbActiveModal,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof NotificationModalComponent
   */
  public ngOnInit() {
    if (this.notification) {
      this._notificationSvc.readNotification(this.notification);
    }
  }

  /**
   *
   *
   * @memberof NotificationModalComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof NotificationModalComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof NotificationModalComponent
   */
  public close($event: MouseEvent): void {
    this._ngbActiveModal.close(true);
  }
}
