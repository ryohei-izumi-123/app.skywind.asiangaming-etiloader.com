import { environment } from '@env/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  Event as Event$
} from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, throttleTime, delay, filter } from 'rxjs/operators';
import { LocaleService } from '@shared/service/locale.service';
import { LoggerService } from '@shared/service/logger.service';
import { SoundService } from '@shared/service/sound.service';
import { ElectronService } from '@shared/service/electron.service';
import { TIso6391 } from '@shared/type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {number}
   * @memberof AppComponent
   */
  private _duration: number = 100;

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof AppComponent
   */
  public set language(language: TIso6391) {
    this._localeSvc.language = language;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof AppComponent
   */
  public get language(): TIso6391 {
    return this._localeSvc.language;
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof AppComponent
   */
  private _isBusy: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof AppComponent
   */
  public set isBusy(isBusy: boolean) {
    this._isBusy = isBusy;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof AppComponent
   */
  public get isBusy(): boolean {
    return this._isBusy;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof AppComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof AppComponent
   */
  @HostListener('document:contextmenu', ['$event'])
  public onContextMenu($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  /**
   *Creates an instance of AppComponent.
   * @param {ElectronService} _electronSvc
   * @param {SoundService} _soundSvc
   * @param {LoggerService} _loggerSvc
   * @param {LocaleService} _localeSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AppComponent
   */
  constructor(
    public _electronSvc: ElectronService,
    private _soundSvc: SoundService,
    private _loggerSvc: LoggerService,
    private _localeSvc: LocaleService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof AppComponent
   */
  public ngOnInit() {
    this.initEnv();
    this._soundSvc.initSound();

    this._subscription.add(
      this._router.events
        .pipe(
          throttleTime(this._duration),
          filter((event: Event$) => event instanceof NavigationStart),
          finalize(() => (this.isBusy = true))
        )
        .subscribe()
    );

    this._subscription.add(
      this._router.events
        .pipe(
          filter(
            (event: Event$) =>
              event instanceof NavigationEnd ||
              event instanceof NavigationCancel ||
              event instanceof NavigationError
          ),
          delay(this._duration),
          finalize(() => (this.isBusy = false))
        )
        .subscribe()
    );
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public initEnv(): void {
    this._loggerSvc.log('info', environment);
    const { env = null } = environment;
    this._electronSvc.sendSetEnv({ env });
  }
}
