import 'reflect-metadata';
import '../polyfills';
import { environment } from '@env/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  APP_INITIALIZER,
  APP_BOOTSTRAP_LISTENER,
  LOCALE_ID,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT,
  ErrorHandler,
  ComponentRef
} from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEnEx from '@angular/common/locales/extra/en';
import localeJa from '@angular/common/locales/ja';
import localeJaEx from '@angular/common/locales/extra/ja';
import localeCn from '@angular/common/locales/zh-Hans';
import localeCnEx from '@angular/common/locales/extra/zh-Hans';

const initLocaleData: () => void = () => {
  registerLocaleData(localeEn, localeEnEx);
  registerLocaleData(localeJa, localeJaEx);
  registerLocaleData(localeCn, localeCnEx);
};
initLocaleData();

import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient
} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { ApiInterceptor } from '@shared/class/api-interceptor';
import { AppInitializer } from '@shared/class/app-initializer';
import { AppBootstrapListener } from '@shared/class/app-bootstrap-listener';
import { AppErrorHandler } from '@shared/class/app-error-handler';
import { FileValueAccessorDirective } from '@shared/directive/file-value-accessor.directive';
import { AppRoutingModule } from '@app/app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from '@app/app.component';
export const TranslateLoaderFactory = (http: HttpClient) => {
  const prefix: string = './assets/i18n/';
  const suffix: string = '.json';
  return new TranslateHttpLoader(http, prefix, suffix);
};
export const DefaultErrorHandler: { provide: any; useClass: any } = {
  provide: ErrorHandler,
  useClass: environment.production ? AppErrorHandler : ErrorHandler
};

/**
 *
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: environment.locale.default
    },
    {
      provide: APP_BASE_HREF,
      useValue: environment.base_href
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    AppInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: (initializer: AppInitializer) => () => initializer.init(),
      deps: [AppInitializer],
      multi: true
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: (bootstrapListener: AppBootstrapListener) => (
        component: ComponentRef<any>
      ) => bootstrapListener.init(component),
      deps: [AppBootstrapListener],
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileValueAccessorDirective,
      multi: true
    },
    DefaultErrorHandler
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent]
})
export class AppModule {}
