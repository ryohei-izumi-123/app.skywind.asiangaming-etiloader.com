import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  Observable,
  from as fromPromise,
  timer as timer$,
  interval as interval$,
  NEVER as NEVER$,
  EMPTY as EMPTY$,
  merge as merge$
} from 'rxjs';
import {
  catchError,
  take,
  distinctUntilChanged,
  concatMap,
  filter,
  map,
  tap,
  delayWhen
} from 'rxjs/operators';
import { ElectronService } from '@shared/service/electron.service';
import { StorageService } from '@shared/service/storage.service';
import { APP_SOUND_TOKEN, toTokenize } from '@shared/token';
import { ISoundOptions } from '@shared/interface';

/**
 *
 *
 * @export
 * @class SoundService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class SoundService implements OnDestroy {
  /**
   *
   *
   * @memberof SoundService
   */
  public set isPlaying(isPlaying: boolean) {
    this._isPlayingSubject.next(isPlaying);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof SoundService
   */
  public get isPlaying(): boolean {
    return this._isPlayingSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof SoundService
   */
  private _isPlayingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof SoundService
   */
  public isPlaying$: Observable<
    boolean
  > = this._isPlayingSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @memberof SoundService
   */
  public set readyState(readyState: boolean) {
    this._readyStateSubject.next(readyState);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof SoundService
   */
  public get readyState(): boolean {
    return this._readyStateSubject.getValue();
  }
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof SoundService
   */
  private _readyStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof SoundService
   */
  public readyState$: Observable<
    boolean
  > = this._readyStateSubject.asObservable().pipe(distinctUntilChanged());

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof SoundService
   */
  private _src: string = './assets/audio/se.ogg';

  /**
   *
   *
   * @private
   * @type {HTMLAudioElement}
   * @memberof SoundService
   */
  private _audio: HTMLAudioElement = null;

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<number>}
   * @memberof SoundService
   */
  private _volumeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );

  /**
   *
   *
   * @type {Observable<number>}
   * @memberof SoundService
   */
  public volume$: Observable<number> = this._volumeSubject.asObservable().pipe(
    filter((value: number) => value !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @memberof SoundService
   */
  public set volume(volume: number) {
    this._volumeSubject.next(volume);
  }

  /**
   *
   *
   * @type {number}
   * @memberof SoundService
   */
  public get volume(): number {
    return this._volumeSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof SoundService
   */
  private _bgmSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof SoundService
   */
  public bgm$: Observable<boolean> = this._bgmSubject.asObservable().pipe(
    filter((value: boolean) => value !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @memberof SoundService
   */
  public set bgm(bgm: boolean) {
    this._bgmSubject.next(bgm);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof SoundService
   */
  public get bgm(): boolean {
    return this._bgmSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof SoundService
   */
  private _seSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof SoundService
   */
  public se$: Observable<boolean> = this._seSubject.asObservable().pipe(
    filter((value: boolean) => value !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @memberof SoundService
   */
  public set se(se: boolean) {
    this._seSubject.next(se);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof SoundService
   */
  public get se(): boolean {
    return this._seSubject.getValue();
  }

  /**
   *
   *
   * @readonly
   * @type {ISoundOptions}
   * @memberof SoundService
   */
  public get optionState(): ISoundOptions {
    return {
      se: this.se,
      bgm: this.bgm,
      volume: this.volume
    };
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof SoundService
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of SoundService.
   * @param {StorageService} _storageSvc
   * @param {ElectronService} _electronSvc
   * @memberof SoundService
   */
  public constructor(
    @Inject(StorageService) private _storageSvc: StorageService,
    @Inject(ElectronService) private _electronSvc: ElectronService
  ) {}

  /**
   *
   *
   * @memberof SoundService
   */
  public ngOnDestroy(): void {
    this._bgmSubject.complete();
    this._seSubject.complete();
    this._volumeSubject.complete();
    this._isPlayingSubject.complete();
    this._readyStateSubject.complete();
    this._subscription.unsubscribe();
    this._audio.removeEventListener('canplaythrough', this._onReady.bind(this));
    this._audio.removeEventListener('load', this._onLoad.bind(this));
    this._audio.removeEventListener('loadeddata', this._onLoad.bind(this));
    this._audio.removeEventListener('loadedmetadata', this._onLoad.bind(this));
    this._audio.removeEventListener('canplay', this._onLoad.bind(this));
    this._audio.removeEventListener('canplaythrough', this._onReady.bind(this));
    this._audio.removeEventListener('play', this._onPlay.bind(this));
    this._audio.removeEventListener('ended', this._onEnded.bind(this));
  }

  /**
   *
   *
   * @public
   * @returns {options}
   * @memberof SoundService
   */
  public initSound(): void {
    const options: ISoundOptions = this._restoreOptions();
    this._storeOptions(options);

    this._subscription.add(
      merge$(this.se$, this.bgm$, this.volume$)
        .pipe(
          map(() => this.optionState),
          distinctUntilChanged(
            (oldVal: ISoundOptions, newVal: ISoundOptions) =>
              JSON.stringify(oldVal) === JSON.stringify(newVal)
          )
        )
        .subscribe((value: ISoundOptions) => this._storeOptions(value))
    );
    this._audio = new Audio(this._src);
    this._audio.addEventListener('load', this._onLoad.bind(this));
    this._audio.addEventListener('loadeddata', this._onLoad.bind(this));
    this._audio.addEventListener('loadedmetadata', this._onLoad.bind(this));
    this._audio.addEventListener('canplay', this._onLoad.bind(this));
    this._audio.addEventListener('canplaythrough', this._onReady.bind(this));
    this._audio.addEventListener('play', this._onPlay.bind(this));
    this._audio.addEventListener('ended', this._onEnded.bind(this));
    this._audio.loop = false;
    this._audio.autoplay = false;
    this._audio.preload = 'auto';
    this._audio.load();

    this._subscription.add(
      merge$(this.isPlaying$, this.readyState$).subscribe()
    );

    this._subscription.add(
      merge$(this.volume$, this.se$).subscribe(() => {
        this._audio.volume = this.volume / 100;
        this._audio.muted = !!!this.se;
      })
    );
  }

  /**
   *
   *
   * @private
   * @returns {options}
   * @memberof SoundService
   */
  private _restoreOptions(): ISoundOptions {
    const options: ISoundOptions = this._storageSvc.get(
      toTokenize(APP_SOUND_TOKEN)
    ) || {
      bgm: true,
      se: true,
      volume: 50
    };

    return options;
  }

  /**
   *
   *
   * @private
   * @param {ISoundOptions} options
   * @memberof SoundService
   */
  private _storeOptions(options: ISoundOptions): void {
    const { bgm, se, volume } = options;

    this.bgm = bgm;
    this.se = se;
    this.volume = volume;

    this._electronSvc.sendRequestChangeVolume(options);
    this._storageSvc.set(toTokenize(APP_SOUND_TOKEN), options);
  }

  /**
   *
   *
   * @param {Event} $event
   * @memberof SoundService
   */
  public _onReady($event: Event) {
    this.readyState = true;
  }

  /**
   *
   *
   * @param {Event} $event
   * @memberof SoundService
   */
  public _onLoad($event: Event) {
    this.readyState = this._audio.readyState > 2;
  }

  /**
   *
   *
   * @param {Event} $event
   * @memberof SoundService
   */
  public _onPlay($event: Event) {
    this.isPlaying = true;
  }

  /**
   *
   *
   * @param {Event} $event
   * @memberof SoundService
   */
  public _onEnded($event: Event) {
    this.isPlaying = false;
  }

  /**
   *
   *
   * @private
   * @memberof SoundService
   */
  private _pause(): void {
    this._audio.pause();
    this._audio.currentTime = 0;
  }

  /**
   *
   *
   * @public
   * @returns {Observable<any>}
   * @memberof SoundService
   */
  public playSE$(): Observable<any> {
    const isMute: boolean = this._audio.muted || this._audio.volume === 0;
    if (isMute) {
      return NEVER$;
    }

    const delay: number = this.isPlaying ? 150 : 0;

    return interval$(delay).pipe(
      filter(() => this.readyState),
      tap(() => this._pause()),
      delayWhen(() => timer$(delay)),
      concatMap(() => fromPromise(this._audio.play())),
      catchError(() => EMPTY$),
      take(1)
    );
  }
}
