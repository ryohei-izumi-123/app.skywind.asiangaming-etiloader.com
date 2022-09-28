import {
  OnChanges,
  SimpleChanges,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription, merge as merge$ } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SoundService } from '@shared/service/sound.service';
import { LocaleService } from '@shared/service/locale.service';
import { ISettingType, IIso6391 } from '@shared/interface';
import { TSettingType, TIso6391, TModalComponent } from '@shared/type';

/**
 *
 *
 * @export
 * @class SettingModalComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styleUrls: ['./setting-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingModalComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @type {TModalComponent}
   * @memberof SettingModalComponent
   */
  public name: TModalComponent = 'CommonModalComponent';

  /**
   *
   *
   * @readonly
   * @type {(keyof IIso6391)[]}
   * @memberof SettingModalComponent
   */
  public get languages(): (keyof IIso6391)[] {
    return this._localeSvc.languages;
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof SettingModalComponent
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
   * @memberof SettingModalComponent
   */
  public get language(): TIso6391 {
    return this._localeSvc.language;
  }

  /**
   *
   *
   * @private
   * @type {(keyof ISettingType)[]}
   * @memberof SettingModalComponent
   */
  private _settingTypes: (keyof ISettingType)[] = ['language', 'sound'];

  /**
   *
   *
   * @readonly
   * @type {(keyof ISettingType)[]}
   * @memberof SettingModalComponent
   */
  public get settingTypes(): (keyof ISettingType)[] {
    return this._settingTypes;
  }

  /**
   *
   *
   * @private
   * @type {TSettingType}
   * @memberof SettingModalComponent
   */
  private _settingType: TSettingType = 'language';

  /**
   *
   *
   * @readonly
   * @type {TSettingType}
   * @memberof SettingModalComponent
   */
  public set settingType(type: TSettingType) {
    this._settingType = type;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {TSettingType}
   * @memberof SettingModalComponent
   */
  public get settingType(): TSettingType {
    return this._settingType;
  }

  /**
   *
   *
   * @type {number}
   * @memberof SettingModalComponent
   */
  public set volume(volume: number) {
    this._soundSvc.volume = volume;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {number}
   * @memberof SettingModalComponent
   */
  public get volume(): number {
    return this._soundSvc.volume;
  }

  /**
   *
   *
   * @type {number}
   * @memberof SettingModalComponent
   */
  public set se(se: boolean) {
    this._soundSvc.se = se;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof SettingModalComponent
   */
  public get se(): boolean {
    return this._soundSvc.se;
  }

  /**
   *
   *
   * @type {number}
   * @memberof SettingModalComponent
   */
  public set bgm(bgm: boolean) {
    this._soundSvc.bgm = bgm;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof SettingModalComponent
   */
  public get bgm(): boolean {
    return this._soundSvc.bgm;
  }

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof SettingModalComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of SettingModalComponent.
   * @param {SoundService} _soundSvc
   * @param {LocaleService} _localeSvc
   * @param {NgbActiveModal} _ngbActiveModal
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SettingModalComponent
   */
  public constructor(
    private _soundSvc: SoundService,
    private _localeSvc: LocaleService,
    private _ngbActiveModal: NgbActiveModal,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof SettingModalComponent
   */
  public ngOnInit() {
    this._subscription.add(
      merge$(
        this._soundSvc.volume$,
        this._soundSvc.bgm$,
        this._soundSvc.se$
      ).subscribe(() => this._changeDetectorRef.markForCheck())
    );
  }

  /**
   *
   *
   * @memberof SettingModalComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof SettingModalComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {TSettingType} type
   * @returns {string}
   * @memberof SettingModalComponent
   */
  public getSettingTypeStyle(type: TSettingType) {
    const isActive: boolean = this.settingType === type;
    const active: string = isActive ? 'bo-highlight-color' : '';

    return `icon-${type} ${active}`;
  }

  /**
   *
   *
   * @param {TIso6391} language
   * @returns {string}
   * @memberof SettingModalComponent
   */
  public getLanguageStyle(language: TIso6391) {
    const isActive: boolean = this.language === language;
    return isActive ? 'active' : 'bo-sub-btn-bg';
  }

  /**
   *
   *
   * @param {TIso6391} language
   * @returns {string}
   * @memberof SettingModalComponent
   */
  public getLanguageSrc(language: TIso6391) {
    switch (language) {
      case 'en':
        return (
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZS' +
          'BJbWFnZVJlYWR5ccllPAAAAflJREFUeNpinDRzn5qN3uFDt16+YWBg+Pv339+KGN0rbVP+//2rW5tf0Hfy/2+mr99+yKpyOl3Ydt8' +
          'njEWIn8f9zj639NC7j78eP//8739GVUUhNUNuhl8//ysKeZrJ/v7z10Zb2PTQTIY1XZO2Xmfad+f7XgkXxuUrVB6cjPVXef78JyMj' +
          'A8PFuwyX7gAZj97+T2e9o3d4BWNp84K1NzubTjAB3fH0+fv6N3qP/ir9bW6ozNQCijB8/8zw/TuQ7r4/ndvN5mZgkpPXiis3Pv34+' +
          'ZPh5t23//79Rwehof/9/NDEgMrOXHvJcrllgpoRN8PFOwy/fzP8+gUlgZI/f/5xcPj/69e/37//AUX+/mXRkN555gsOG2xt/5hZQM' +
          'wF4r9///75++f3nz8nr75gSms82jfvQnT6zqvXPjC8e/srJQHo9P9fvwNtAHmG4f8zZ6dDc3bIyM2LTNlsbtfM9OPHH3FhtqUz3eX' +
          'X9H+cOy9ZMB2o6t/Pn0DHMPz/b+2wXGTvPlPGFxdcD+mZyjP8+8MUE6sa7a/xo6Pykn1s4zdzIZ6///8zMGpKM2pKAB0jqy4UE7/m' +
          'sKat6Jw5mafrsxNtWZ6/fjvNLW29qv25pQd///n+5+/fxDDVbcc//P/zx/36m5Ub9zL8+7t66yEROcHK7q5bldMBAgwADcRBCuVLf' +
          'oEAAAAASUVORK5CYII='
        );

      case 'ja':
        return (
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAArCAMAAAD/hH51AAADAFBMVEX////88vT55+v23ePz09v' +
          'yzNXuvsntusbpqrnmoLHkmavmobL56Oz89ff12eDvxM7qrrzjlajdf5bYaoTSVHLORGXJM1fFI0rBEz29Ay+8AC3egJbqr7312uH56' +
          'e3wxc/norLfhJrXaIPQTGzILVLAETvBEjzILlPYaYPfhZvno7PwxtD56u788/XxytPmn7DceJDSVXPJMVXADjnJMlbTVnTceZHxy9T' +
          '++vvz0NjadI3PSWnEIEe8AS7PSmrbdY3z0dn99/jwx9HWZH++BzPKNFjXZYDjlqn9+Pn45errssDbd4/LO16+CDS9BDDHKlDXZoH01' +
          'Nz//v7+/P3hjqLRT27BFD3CFT7RUXDikKTyztfgiJ3ADznQS2vgiZ7+/f345uq/DTj23uTsuMXYa4XFJEvGJUvZbYftucX66++/CjX' +
          '45Ongip/LOFu9Ai/LOVzhi5/01dzHK1Dfh5z34OX67fD9+frprbu9BTHQTm3CFj/kmKrkmqz0197npbXMPF7MPV/oprbEHkbCF0DAE' +
          'DrUXXrz0trTWHXORWbtvMjtu8fJMFX++/zHKE7DHET99vjDG0PCGEHDGkLikaTFIUjEHUXKNVnuwMv12N/67O/Zboi+BjL78fPvw87' +
          '23OL33+XdfJPegZfuvcn78PPDGULprLvOQ2ThjaG+CTTqsL789PbGJkzyzdb34ebNP2HNQWP44+jNQGLxydPlm63vwczlnK3TWXbSU' +
          '3Hpq7rYbIbZb4jWYn7UXHn77vHKN1rRUG/UWnfVYX3acYrjk6brtMG/Czb77/LVX3vyz9fEH0fPSGjdfZT01t3eg5nFIknacovIL1T' +
          '22+HMPmDTV3Xlna7xyNLORmfvws3PR2fSUnHbdo7ce5LHKU/stsPhjKDILFHkl6n34ufmnq/VXnrWY3/GJ03st8Trsb/stcLZcInoqL' +
          'fuv8rQTWzVYHy/DDfNQmPKNlnfhpvop7fXZ4Loqbjegpjrs8DikqXUW3jjlKfcepHdfpXac4zLOl3npLTij6NhxKfGAAAACXBIWXMAA' +
          'AsTAAALEwEAmpwYAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhp' +
          'SHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmU' +
          'gNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly' +
          '93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4b' +
          'XA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIg' +
          'eG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmF' +
          'kb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZU' +
          'V2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9I' +
          'jIwMTktMDgtMDhUMTM6NDQ6MzQrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA4LTA4VDEzOjQ3OjIyKzAzOjAwIiB4bXA6TWV0' +
          'YWRhdGFEYXRlPSIyMDE5LTA4LTA4VDEzOjQ3OjIyKzAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9' +
          'kZT0iMiIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhmOD' +
          'AwZTJiLWE1ZjYtNGE4Zi1iNTA2LWVjNDEwZWJmYmNiZCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4ZjgwMGUyYi1hNWY2LTRhO' +
          'GYtYjUwNi1lYzQxMGViZmJjYmQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ZjgwMGUyYi1hNWY2LTRhOGYtYjUw' +
          'Ni1lYzQxMGViZmJjYmQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV' +
          '2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhmODAwZTJiLWE1ZjYtNGE4Zi1iNTA2LWVjNDEwZWJmYmNiZCIgc3RFdnQ6d2hlbj0iMjAxOS' +
          '0wOC0wOFQxMzo0NDozNCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9za' +
          'CkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8' +
          'P3hwYWNrZXQgZW5kPSJyIj8+XtxY5AAAAJhJREFUSIntlLENgDAMBA0SCyAasgIzMApL09MyBw1IKPxHMQ+dv0oc+fRxYpuFQh+oKZz' +
          'N27nYXwHSfcMRFJCyPUMwQJ5PCQTwzGeEtjqfCDog+dACdoC1qA6gBeTAUQHfFXTApAJ6FdCBGHoFWsTaV3AJAUrtLzlYVcCAgridYR' +
          'k97eyowl8TSZ+J+lQ2s/E6dH2MUOiNDl27EasYjwgKAAAAAElFTkSuQmCC'
        );

      default:
        return '';
    }
  }

  /**
   *
   *
   * @param {number} $event
   * @memberof SettingModalComponent
   */
  public onVolumeChange($event: number) {
    this.volume = $event;
  }

  /**
   *
   *
   * @param {number} $event
   * @memberof SettingModalComponent
   */
  public onSeToggle($event: boolean) {
    this.se = $event;
  }

  /**
   *
   *
   * @param {number} $event
   * @memberof SettingModalComponent
   */
  public onBgmToggle($event: boolean) {
    this.bgm = $event;
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof SettingModalComponent
   */
  public close($event: MouseEvent): void {
    return this._ngbActiveModal.close(true);
  }
}
