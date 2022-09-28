import { Injector, Injectable, ComponentRef } from '@angular/core';
import { LoggerService } from '@shared/service/logger.service';

/**
 *
 * @export
 * @class AppBootstrapListener
 */
@Injectable({
  providedIn: 'root'
})
export class AppBootstrapListener {
  /**
   *Creates an instance of AppBootstrapListener.
   * @param {Injector} _injector
   * @memberof AppBootstrapListener
   */
  public constructor(private _injector: Injector) {}

  /**
   *
   * @returns {Promise<string>}
   * @memberof AppBootstrapListener
   */
  public init(component: ComponentRef<any>): void {
    const _loggerSvc: LoggerService = this._injector.get(LoggerService);
    _loggerSvc.log('info', component.instance.title);
  }
}
