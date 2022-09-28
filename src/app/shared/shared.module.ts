import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgbModalModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
/**
 *
 */
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  a11y: true,
  direction: 'horizontal',
  slidesPerView: 'auto',
  keyboard: false,
  mousewheel: false,
  scrollbar: false,
  navigation: false,
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    dynamicBullets: true,
    clickable: true,
    hideOnClick: false
  },
  init: true,
  initialSlide: 0,
  speed: 1,
  setWrapperSize: true,
  width: 140,
  height: 150,
  autoHeight: true,
  spaceBetween: 1,
  autoplay: true,
  allowSlidePrev: true,
  allowSlideNext: true,
  preventClicks: false,
  preventClicksPropagation: false,
  slideToClickedSlide: true,
  preloadImages: true,
  updateOnImagesReady: true,
  loop: true
};

import {
  FileValueAccessorDirective,
  WebviewDirective,
  DraggableDirective,
  ClickSoundDirective,
  PlayGameDirective
} from '@shared/directive';
import {
  BignumberPipe,
  CurrencyPipe,
  InflectorPipe,
  MdToHtmlPipe,
  MomentPipe,
  Nl2brPipe,
  QrPipe,
  StatusPipe
} from '@shared/pipe';
import {
  PageNotFoundComponent,
  GameInfoModalComponent,
  SettingModalComponent,
  CommonModalComponent,
  RangeSliderComponent,
  SwitchButtonComponent,
  AudioComponent,
  GameThumbComponent,
  GameTooltipComponent,
  GameThumbImageComponent,
  GameThumbListComponent,
  GameThumbLimitsComponent,
  AsideToggleComponent,
  AsideListComponent,
  ClockComponent,
  ScreensSliderComponent,
  GameInfoComponent,
  GameScoreboardComponent,
  GameLiveDealerComponent,
  GameLiveDealerImageComponent,
  PreloaderComponent,
  GameThumbOfflineComponent,
  GameLiveCountdownComponent,
  GameLimitsSelectorComponent,
  HeaderComponent,
  FooterComponent,
  NotificationModalComponent,
  NetworkComponent,
  OfflineMessageComponent
} from '@shared/component';

const directives: any[] = [
  FileValueAccessorDirective,
  WebviewDirective,
  DraggableDirective,
  ClickSoundDirective,
  PlayGameDirective
];
const pipes: any[] = [
  BignumberPipe,
  CurrencyPipe,
  InflectorPipe,
  MdToHtmlPipe,
  MomentPipe,
  Nl2brPipe,
  QrPipe,
  StatusPipe
];
const components: any[] = [
  PageNotFoundComponent,
  GameInfoModalComponent,
  SettingModalComponent,
  CommonModalComponent,
  RangeSliderComponent,
  SwitchButtonComponent,
  AudioComponent,
  GameThumbComponent,
  GameTooltipComponent,
  GameThumbImageComponent,
  GameThumbListComponent,
  GameThumbLimitsComponent,
  AsideToggleComponent,
  AsideListComponent,
  ClockComponent,
  ScreensSliderComponent,
  GameInfoComponent,
  GameScoreboardComponent,
  GameLiveDealerComponent,
  GameLiveDealerImageComponent,
  PreloaderComponent,
  GameThumbOfflineComponent,
  GameLiveCountdownComponent,
  GameLimitsSelectorComponent,
  HeaderComponent,
  FooterComponent,
  NotificationModalComponent,
  NetworkComponent,
  OfflineMessageComponent
];
const modules: any[] = [
  RouterModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  ClickOutsideModule,
  NgbModalModule,
  SwiperModule
];
const entryComponents: any[] = [
  GameInfoModalComponent,
  SettingModalComponent,
  CommonModalComponent,
  NotificationModalComponent
];
const providers: any[] = [
  {
    provide: NgbActiveModal,
    useValue: NgbActiveModal
  },
  {
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  }
];
const schemas: any[] = [CUSTOM_ELEMENTS_SCHEMA];

@NgModule({
  declarations: [...components, ...pipes, ...directives],
  imports: [...modules],
  exports: [...modules, ...components, ...pipes, ...directives],
  entryComponents: [...entryComponents],
  providers: [...providers],
  schemas: [...schemas]
})
export class SharedModule {}
