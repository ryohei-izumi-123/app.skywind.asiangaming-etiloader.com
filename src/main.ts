import { environment } from '@env/environment';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { hmrBootstrap, IBootstrap } from './hmr';
if (environment.production) {
  enableProdMode();
}

const bootstrap: IBootstrap = (): Promise<NgModuleRef<AppModule>> =>
  platformBrowserDynamic().bootstrapModule(AppModule, {
    preserveWhitespaces: false
  });
if (environment.hmr) {
  hmrBootstrap(module, bootstrap);
} else {
  bootstrap().catch(console.error.bind(console));
}
