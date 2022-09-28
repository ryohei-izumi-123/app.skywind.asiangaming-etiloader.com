import {
  ViewChild,
  ElementRef,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription, merge as merge$ } from 'rxjs';
import { SoundService } from '@shared/service/sound.service';

/**
 *
 *
 * @export
 * @class AudioComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {ElementRef}
   * @memberof AudioComponent
   */
  @ViewChild('audio', { static: false })
  public audio: ElementRef;

  /**
   *
   *
   * @type {number}
   * @memberof AudioComponent
   */
  public get volume(): number {
    return this._soundSvc.volume;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof AudioComponent
   */
  public get bgm(): boolean {
    return this._soundSvc.bgm;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof AudioComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of AudioComponent.
   * @param {SoundService} _soundSvc
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AudioComponent
   */
  public constructor(
    private _soundSvc: SoundService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof AudioComponent
   */
  public ngOnInit() {
    this._subscription.add(
      merge$(this._soundSvc.volume$, this._soundSvc.bgm$).subscribe(() =>
        this._changeDetectorRef.markForCheck()
      )
    );
  }

  /**
   *
   *
   * @memberof AudioComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof AudioComponent
   */
  public ngAfterViewInit() {}
}
