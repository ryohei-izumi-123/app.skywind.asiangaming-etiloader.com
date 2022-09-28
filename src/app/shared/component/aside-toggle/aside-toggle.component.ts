import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from '@shared/service';

/**
 *
 *
 * @export
 * @class AsideToggleComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-aside-toggle',
  templateUrl: './aside-toggle.component.html',
  styleUrls: ['./aside-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideToggleComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @readonly
   * @memberof AsideToggleComponent
   */
  public set isSmallScreen(isSmallScreen: boolean) {
    this._isSmallScreen = isSmallScreen;
  }

  /**
   *
   *
   * @readonly
   * @memberof AsideToggleComponent
   */
  public get isSmallScreen(): boolean {
    return this._isSmallScreen;
  }

  /**
   *
   *
   *
   * @memberof AsideToggleComponent
   */
  public _isSmallScreen: boolean = false;

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof AsideToggleComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of AsideToggleComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AsideToggleComponent
   */
  public constructor(
    private _uiSvc: UiService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof AsideToggleComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._uiSvc.isSmallScreen$.subscribe(
        (isSmallScreen: boolean) => (this.isSmallScreen = isSmallScreen)
      )
    );
  }

  /**
   *
   *
   * @memberof AsideToggleComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {Event} $event
   * @memberof AsideToggleComponent
   */
  public onClick($event: Event): void {
    this._uiSvc.isAsideOpen = !this._uiSvc.isAsideOpen;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   *
   * @memberof AsideToggleComponent
   */
  public getToggleStyle(): string {
    if (this.isSmallScreen) {
      return 'small';
    }

    return '';
  }

  /**
   *
   *
   *
   * @memberof AsideToggleComponent
   */
  public getIconStyle(): string {
    if (this._uiSvc.isAsideOpen) {
      return 'open';
    }

    return '';
  }
}
