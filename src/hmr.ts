import { NgModuleRef, ApplicationRef, ComponentRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';
export declare type IBootstrap = () => Promise<NgModuleRef<any>>;

/**
 *
 * @param {*} module
 * @param {IBootstrap} bootstrap
 */
export const hmrBootstrap = (module: any, bootstrap: IBootstrap) => {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();

  bootstrap()
    .then((mod: NgModuleRef<any>) => (ngModule = mod))
    .catch(console.error.bind(console));

  module.hot.dispose(() => {
    const appRef$: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const $elements: any[] = appRef$.components.map(
      (c: ComponentRef<any>) => c.location.nativeElement
    );
    const forge: Function = createNewHosts($elements);
    ngModule.destroy();
    forge();
  });
};
