import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  merge as merge$,
  Observable,
  BehaviorSubject,
  EMPTY as EMPTY$,
  interval as interval$,
  Subscription
} from 'rxjs';
import {
  take,
  distinctUntilChanged,
  catchError,
  concatMap,
  map,
  filter,
  debounceTime
} from 'rxjs/operators';
import * as _ from 'lodash';
import { ApiService } from '@shared/service/api.service';
import { ElectronService } from '@shared/service/electron.service';
import { INotification, IEmpty, IPageable } from '@shared/interface';

/**
 *
 *
 * @export
 * @class NotificationService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<INotification[]>}
   * @memberof NotificationService
   */
  private _notificationsSubject: BehaviorSubject<
    INotification[]
  > = new BehaviorSubject<INotification[]>([]);

  /**
   *
   *
   * @type {Observable<INotification[]>}
   * @memberof NotificationService
   */
  public notifications$: Observable<
    INotification[]
  > = this._notificationsSubject.asObservable().pipe(
    filter(
      (notifications: INotification[]) =>
        _.isArray(notifications) && _.size(notifications) > 0
    ),
    distinctUntilChanged(
      (a: INotification[], b: INotification[]) => _.size(a) === _.size(b)
    )
  );

  /**
   *
   *
   * @returns {INotification[]}
   * @memberof NotificationService
   */
  public get notifications(): INotification[] {
    return this._notificationsSubject.getValue();
  }

  /**
   *
   *
   * @param {INotification[]} notifications
   * @returns {void}
   * @memberof NotificationService
   */
  public set notifications(notifications: INotification[]) {
    this._notificationsSubject.next(notifications);
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof NotificationService
   */
  private _interval: number = 300000;

  /**
   *Creates an instance of NotificationService.
   * @param {ApiService} _apiSvc
   * @memberof NotificationService
   */
  public constructor(
    @Inject(ElectronService) private _electronSvc: ElectronService,
    @Inject(ApiService) private _apiSvc: ApiService
  ) {
    merge$(
      interval$(0).pipe(take(1)),
      interval$(this._interval),
      this._electronSvc.windowState$.pipe(
        filter((windowState: boolean) => windowState)
      )
    )
      .pipe(
        debounceTime(1000),
        concatMap(() => this.getAll$().pipe(catchError(() => EMPTY$)))
      )
      .subscribe(
        (notifications: INotification[]) => (this.notifications = notifications)
      );
  }

  /**
   *
   *
   * @memberof NotificationService
   */
  public ngOnDestroy() {
    this._notificationsSubject.complete();
  }

  /**
   *
   *
   * @returns {Observable<INotification[]>}
   * @memberof NotificationService
   */
  public getAll$(): Observable<INotification[]> {
    return this._apiSvc
      .get<IPageable<INotification>>(
        `${environment.api.endpoint.api}/notification`
      )
      .pipe(
        map((response: IPageable<INotification>) => response.result),
        take(1)
      );
  }

  /**
   *
   *
   * @param {number} id
   * @returns {Observable<INotification>}
   * @memberof NotificationService
   */
  public getById$(id: number): Observable<INotification> {
    if (!id) {
      return EMPTY$;
    }

    return this._apiSvc
      .get<INotification>(`${environment.api.endpoint.api}/notification/${id}`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {number} id
   * @returns {Observable<IEmpty>}
   * @memberof NotificationService
   */
  public updateById$(id: number): Observable<IEmpty> {
    if (!id) {
      return EMPTY$;
    }

    return this._apiSvc
      .patch<IEmpty>(`${environment.api.endpoint.api}/notification/${id}`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {number} id
   * @returns {Observable<IEmpty>}
   * @memberof NotificationService
   */
  public deleteById$(id: number): Observable<IEmpty> {
    if (!id) {
      return EMPTY$;
    }

    return this._apiSvc
      .delete<IEmpty>(`${environment.api.endpoint.api}/notification/${id}`)
      .pipe(take(1));
  }

  /**
   *
   *
   * @param {INotification} notification
   * @memberof NotificationService
   */
  public readNotification(notification: INotification): Subscription {
    return this.updateOne$(notification)
      .pipe(
        catchError(() => EMPTY$),
        take(1)
      )
      .subscribe();
  }

  /**
   *
   *
   * @param {INotification} notification
   * @returns {Observable<INotification>}
   * @memberof NotificationService
   */
  public getOne$(notification: INotification): Observable<INotification> {
    return this.getById$(notification.id);
  }

  /**
   *
   *
   * @param {INotification} notification
   * @returns {Observable<IEmpty>}
   * @memberof NotificationService
   */
  public updateOne$(notification: INotification): Observable<IEmpty> {
    return this.updateById$(notification.id);
  }

  /**
   *
   *
   * @param {INotification} notification
   * @returns {Observable<IEmpty>}
   * @memberof NotificationService
   */
  public deleteOne$(notification: INotification): Observable<IEmpty> {
    return this.deleteById$(notification.id);
  }
}
