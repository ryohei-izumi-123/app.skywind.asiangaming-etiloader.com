import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Subscription, fromEvent as fromEvent$ } from 'rxjs';
import { map, throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { GameService } from '@shared/service';
import { IGameCategory } from '@shared/interface';

/**
 *
 *
 * @export
 * @class AsideListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-aside-list',
  templateUrl: './aside-list.component.html',
  styleUrls: ['./aside-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideListComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {ElementRef}
   * @memberof AsideListComponent
   */
  @ViewChild('input', { static: false }) public input: ElementRef;

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof AsideListComponent
   */
  private _gameFilter: string = null;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof AsideListComponent
   */
  public set gameFilter(value: string) {
    this._gameFilter = value;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof AsideListComponent
   */
  public get gameFilter(): string {
    return this._gameFilter;
  }

  /**
   *
   *
   * @readonly
   * @memberof AsideListComponent
   */
  public get gameCategory(): IGameCategory {
    return this._gameSvc.category;
  }

  /**
   *
   *
   * @readonly
   * @memberof AsideListComponent
   */
  public set gameCategory(category: IGameCategory) {
    this._gameSvc.category = category;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGameCategory[]}
   * @memberof AsideListComponent
   */
  public get gameCategories(): IGameCategory[] {
    return this._gameSvc.categories;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof AsideListComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of AsideListComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AsideListComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof AsideListComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof AsideListComponent
   */
  public ngAfterViewInit() {
    this._subscription.add(
      fromEvent$(<HTMLInputElement>this.input.nativeElement, 'change')
        .pipe(
          map((event: Event) => event.target['value']),
          throttleTime(100),
          distinctUntilChanged()
        )
        .subscribe((value: string) => (this._gameSvc.filter = value))
    );
  }

  /**
   *
   *
   * @memberof AsideListComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof AsideListComponent
   */
  public onChange(value: string) {}

  /**
   *
   *
   * @returns {string}
   * @memberof AsideListComponent
   */
  public getItemStyle(item: IGameCategory): string {
    if (this.gameCategory && this.gameCategory.id === item.id) {
      return 'active';
    }

    return '';
  }
}
