import {
  ElementRef,
  Directive,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { Subscription, fromEvent as fromEvent$ } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { SoundService } from '@shared/service';

/**
 *
 *
 * @export
 * @class ClickSoundDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[clickSound]'
})
export class ClickSoundDirective implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof ClickSoundDirective
   */
  private _subscription: Subscription = new Subscription();

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @memberof ClickSoundDirective
   */
  @HostListener('doubleclick', ['$event'])
  public onClick($event: MouseEvent): void {
    this.playSafe();
  }

  /**
   *Creates an instance of ClickSoundDirective.
   * @param {SoundService} _soundSvc
   * @memberof ClickSoundDirective
   */
  public constructor(
    private _soundSvc: SoundService,
    public _element: ElementRef
  ) {}

  /**
   *
   *
   * @memberof ClickSoundDirective
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof ClickSoundDirective
   */
  public ngAfterViewInit() {
    const $dom: HTMLElement = this._element.nativeElement;
    this._subscription.add(
      fromEvent$($dom, 'click')
        .pipe(throttleTime(250))
        .subscribe(() => this.playSafe())
    );
  }

  /**
   *
   *
   * @memberof ClickSoundDirective
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  /**
   *
   *
   * @private
   * @returns {*}
   * @memberof ClickSoundDirective
   */
  private playSafe(): any {
    this._subscription.add(this._soundSvc.playSE$().subscribe());
  }
}
