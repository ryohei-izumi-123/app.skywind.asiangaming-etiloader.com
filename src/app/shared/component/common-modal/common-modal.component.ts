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
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TModalComponent } from '@shared/type';

/**
 *
 *
 * @export
 * @class CommonModalComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonModalComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @type {TModalComponent}
   * @memberof CommonModalComponent
   */
  public name: TModalComponent = 'CommonModalComponent';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof CommonModalComponent
   */
  private _title: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof CommonModalComponent
   */
  public get title(): string {
    return this._title;
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof CommonModalComponent
   */
  @Input()
  public set title(title: string) {
    this._title = title;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof CommonModalComponent
   */
  private _body: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof CommonModalComponent
   */
  public get body(): string {
    return this._body;
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof CommonModalComponent
   */
  @Input()
  public set body(body: string) {
    this._body = body;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof CommonModalComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of CommonModalComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {NgbActiveModal} _ngbActiveModal
   * @memberof CommonModalComponent
   */
  public constructor(
    private _ngbActiveModal: NgbActiveModal,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof CommonModalComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof CommonModalComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof CommonModalComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof CommonModalComponent
   */
  public close($event: MouseEvent): void {
    return this._ngbActiveModal.close(true);
  }
}
