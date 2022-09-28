import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';

/**
 *
 *
 * @export
 * @class SwitchButtonComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchButtonComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @type {ElementRef}
   * @memberof SwitchButtonComponent
   */
  @ViewChild('input', { static: false })
  public input: ElementRef;

  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof SwitchButtonComponent
   */
  @Output()
  public valueChanges$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof SwitchButtonComponent
   */
  private _checked: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof SwitchButtonComponent
   */
  public get checked(): boolean {
    return this._checked;
  }

  /**
   *
   *
   * @memberof SwitchButtonComponent
   */
  @Input()
  public set checked(checked: boolean) {
    this._checked = checked;
    this.valueChanges$.emit(this.checked);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof SwitchButtonComponent
   */
  private _text: string = null;

  /**
   *
   *
   * @type {number}
   * @memberof SwitchButtonComponent
   */
  public get text(): string {
    return this._text;
  }

  /**
   *
   *
   * @memberof SwitchButtonComponent
   */
  @Input()
  public set text(text: string) {
    this._text = text;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof SwitchButtonComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of SwitchButtonComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SwitchButtonComponent
   */
  public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   *
   *
   * @memberof SwitchButtonComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof SwitchButtonComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof SwitchButtonComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof SwitchButtonComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {Event} $event
   * @memberof SwitchButtonComponent
   */
  public onChange($event: Event) {
    this.checked = (<HTMLInputElement>this.input.nativeElement).checked;
    this._changeDetectorRef.markForCheck();
  }
}
