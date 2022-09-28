import { Inject, Injectable, OnDestroy, EventEmitter } from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  NEVER as NEVER$,
  EMPTY as EMPTY$,
  from as fromPromise,
  Subscription
} from 'rxjs';
import { filter, finalize, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { TLayoutSize, TModalComponent } from '@shared/type';
import { CommonModalComponent } from '@shared/component/common-modal/common-modal.component';
import { GameInfoModalComponent } from '@shared/component/game-info-modal/game-info-modal.component';
import { SettingModalComponent } from '@shared/component/setting-modal/setting-modal.component';
import { NotificationModalComponent } from '@shared/component/notification-modal/notification-modal.component';

/**
 *
 */
export type TModalComponentRef$ =
  | typeof CommonModalComponent
  | typeof GameInfoModalComponent
  | typeof SettingModalComponent
  | typeof NotificationModalComponent;

/**
 *
 *
 * @export
 * @class ModalService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {
  /**
   *
   *
   * @readonly
   * @type {Observable<TModalComponent>}
   * @memberof ModalService
   */
  public get afterClosed$(): Observable<TModalComponent> {
    return this._afterClosed$
      .asObservable()
      .pipe(filter((component: TModalComponent) => component !== null));
  }

  /**
   *
   *
   * @private
   * @type {EventEmitter<TModalComponent>}
   * @memberof ModalService
   */
  private _afterClosed$: EventEmitter<TModalComponent> = new EventEmitter<
    TModalComponent
  >(null);

  /**
   *
   *
   * @readonly
   * @type {Observable<TModalComponent>}
   * @memberof ModalService
   */
  public get beforeOpen$(): Observable<TModalComponent> {
    return this._beforeOpen$
      .asObservable()
      .pipe(filter((component: TModalComponent) => component !== null));
  }

  /**
   *
   *
   * @private
   * @type {EventEmitter<TModalComponent>}
   * @memberof ModalService
   */
  private _beforeOpen$: EventEmitter<TModalComponent> = new EventEmitter<
    TModalComponent
  >(null);

  /**
   *
   *
   * @protected
   * @type {Subscription}
   * @memberof ModalService
   */
  private _subscription: Subscription = new Subscription();

  /**
   *
   *
   * @private
   * @type NgbModalRef
   * @memberof ModalService
   */
  private _modalRef$: NgbModalRef;

  /**
   *Creates an instance of ModalService.
   * @param {NgbModal} _ngbModal
   * @memberof ModalService
   */
  public constructor(@Inject(NgbModal) private _ngbModal: NgbModal) {}

  /**
   *
   *
   * @memberof ModalService
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof ModalService
   */
  public get hasOpenModal(): boolean {
    return this._ngbModal.hasOpenModals();
  }

  /**
   *
   *
   * @returns {void}
   * @memberof ModalService
   */
  public dismissAll(): void {
    if (this.hasOpenModal) {
      return this._ngbModal.dismissAll();
    }
  }

  /**
   *
   *
   * @returns {void}
   * @memberof ModalService
   */
  public dismiss(): void {
    if (this.hasOpenModal) {
      if (this._modalRef$) {
        this._modalRef$.dismiss();
      }
    }
  }

  /**
   *
   *
   * @returns {void}
   * @memberof ModalService
   */
  public close(): void {
    if (this.hasOpenModal) {
      if (this._modalRef$) {
        this._modalRef$.close();
      }
    }
  }

  /**
   *
   *
   * @private
   * @param {TModalComponent} name
   * @returns {boolean}
   * @memberof ModalService
   */
  private findByComponentName(name: TModalComponent): boolean {
    try {
      if (_.has(this._modalRef$, 'componentInstance')) {
        const componentRef$: TModalComponentRef$ = _.get(
          this._modalRef$,
          'componentInstance'
        );
        const _name: string = _.get(componentRef$, 'name');

        return name === _name;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   *
   * @template T
   * @param {TModalComponent} name
   * @param {TLayoutSize} [size='large']
   * @returns {NgbModalRef}
   * @memberof ModalService
   */
  public open<T>(
    name: TModalComponent,
    size: TLayoutSize = 'large'
  ): NgbModalRef {
    let componentRef$: TModalComponentRef$;
    let modalCSSClass: string = '';
    switch (name) {
      case 'SettingModalComponent':
        componentRef$ = SettingModalComponent;
        modalCSSClass = `modal__setting ${size}`;
        break;

      case 'GameInfoModalComponent':
        componentRef$ = GameInfoModalComponent;
        modalCSSClass = `modal__game--info ${size}`;
        break;

      default:
      case 'CommonModalComponent':
        componentRef$ = CommonModalComponent;
        modalCSSClass = `modal__common ${size}`;
        break;

      case 'NotificationModalComponent':
        componentRef$ = NotificationModalComponent;
        modalCSSClass = `modal__notification ${size}`;
        break;
    }

    if (this.hasOpenModal) {
      if (this.findByComponentName(name)) {
        return this._modalRef$;
      }

      this.dismiss();
    }

    const options: NgbModalOptions = {
      windowClass: `modal fade in ${modalCSSClass}`,
      container: '.modal-root',
      backdrop: 'static',
      centered: true,
      keyboard: false
    };
    this._modalRef$ = this._ngbModal.open(componentRef$, options);
    this._beforeOpen$.emit(name);
    this._afterClosed$.emit(null);
    this._subscription.add(this.subscriveAfterClosed<T>(name));

    return this._modalRef$;
  }

  /**
   *
   *
   * @private
   * @template T
   * @param {TModalComponent} name
   * @returns {Subscription}
   * @memberof ModalService
   */
  private subscriveAfterClosed<T>(name: TModalComponent): Subscription {
    if (!this._modalRef$) {
      this.dispose();
      return EMPTY$.subscribe();
    }

    return this._subscription.add(
      fromPromise(this._modalRef$.result)
        .pipe(
          finalize(() => this.dispose(name)),
          catchError(() => NEVER$)
        )
        .subscribe()
    );
  }

  /**
   *
   *
   * @private
   * @param {TModalComponent} name
   * @memberof ModalService
   */
  private dispose(name: TModalComponent = null): void {
    this._modalRef$ = null;
    this._beforeOpen$.emit(null);
    this._afterClosed$.emit(name);
  }
}
