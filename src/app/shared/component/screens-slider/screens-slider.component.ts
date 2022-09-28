import {
  Input,
  ViewChild,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { IGame, IGameSetting } from '@shared/interface';
import { GameService } from '@shared/service';

/**
 *
 *
 * @export
 * @class ScreensSliderComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-screens-slider',
  templateUrl: './screens-slider.component.html',
  styleUrls: ['./screens-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreensSliderComponent implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {IGameSetting}
   * @memberof ScreensSliderComponent
   */
  private _setting: IGameSetting = null;

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof ScreensSliderComponent
   */
  @Input()
  public set setting(setting: IGameSetting) {
    this._setting = setting;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGameSetting}
   * @memberof ScreensSliderComponent
   */
  public get setting(): IGameSetting {
    return this._setting;
  }

  /**
   *
   *
   * @private
   * @type {IGame}
   * @memberof ScreensSliderComponent
   */
  private _game: IGame = null;

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof ScreensSliderComponent
   */
  @Input()
  public set game(game: IGame) {
    this._game = game;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IGame}
   * @memberof ScreensSliderComponent
   */
  public get game(): IGame {
    return this._game;
  }

  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof ScreensSliderComponent
   */
  private _images: string[] = [];

  /**
   *
   *
   * @readonly
   * @type {string[]}
   * @memberof ScreensSliderComponent
   */
  @Input()
  public set images(images: string[]) {
    this._images = images;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {string[]}
   * @memberof ScreensSliderComponent
   */
  public get images(): string[] {
    return this._images;
  }

  /**
   *
   *
   * @type {SwiperConfigInterface}
   * @memberof ScreensSliderComponent
   */
  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
      hideOnClick: false
    },
    init: true,
    initialSlide: 0,
    spaceBetween: 0,
    speed: 1000,
    width: 240,
    setWrapperSize: true,
    autoHeight: true,
    autoplay: false,
    loop: false,
    allowSlidePrev: true,
    allowSlideNext: true,
    preventClicks: false,
    preventClicksPropagation: false,
    slideToClickedSlide: true,
    preloadImages: true,
    updateOnImagesReady: true
  };

  /**
   *
   *
   * @type {SwiperDirective}
   * @memberof ScreensSliderComponent
   */
  @ViewChild(SwiperDirective, { static: false })
  public directiveRef$?: SwiperDirective;

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof ScreensSliderComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of ScreensSliderComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ScreensSliderComponent
   */
  public constructor(
    private _gameSvc: GameService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof ScreensSliderComponent
   */
  public ngOnInit() {
    if (this.game) {
      this.setting = this._gameSvc.pluckSettingByCode(this.game);
      if (this.setting) {
        if (
          _.has(this.setting, 'meta.poster') &&
          this.setting.meta.poster.exists &&
          _.has(this.setting, 'images.poster')
        ) {
          this.images.push(_.get(this.setting, 'images.poster'));
        }

        if (
          _.has(this.setting, 'meta.screenshots') &&
          this.setting.meta.screenshots.exists &&
          _.has(this.setting, 'screenshots')
        ) {
          _.values(_.get(this.setting, 'screenshots')).map((value: string) =>
            this.images.push(value)
          );
        } else {
          if (
            _.has(this.setting, 'meta.screenshots_hd') &&
            this.setting.meta.screenshots_hd.exists &&
            _.has(this.setting, 'screenshots_hd')
          ) {
            _.values(_.get(this.setting, 'screenshots_hd')).map(
              (value: string) => this.images.push(value)
            );
          }
        }
      }
    }
  }

  /**
   *
   *
   * @memberof ScreensSliderComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof ScreensSliderComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
