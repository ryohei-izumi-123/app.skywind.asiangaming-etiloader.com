import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TStatus } from '@shared/type/status';

/**
 *
 *
 * @export
 * @class StatusPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  /**
   *Creates an instance of StatusPipe.
   * @param {TranslateService} _translateSvc
   * @memberof StatusPipe
   */
  constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {}

  /**
   *
   *
   * @param {TStatus} value
   * @param {string} [args]
   * @returns {string}
   * @memberof StatusPipe
   */
  public transform(value: TStatus, args?: string): string {
    let label: string = '';
    switch (value) {
      case 'active':
        label = this._translateSvc.instant('common.status.active');
        break;
      case 'inactive':
        label = this._translateSvc.instant('common.status.inactive');
        break;
      case 'pending':
        label = this._translateSvc.instant('common.status.pending');
        break;
      default:
        label = this._translateSvc.instant('common.status.unknown');
        break;
    }

    if ('color' === args) {
      switch (value) {
        case 'active':
          label = 'primary';
          break;
        case 'inactive':
          label = 'warn';
          break;
        case 'pending':
          label = 'accent';
          break;
        default:
          label = '';
          break;
      }
    }
    if ('icon' === args) {
      switch (value) {
        case 'active':
          label = 'check';
          break;
        case 'inactive':
          label = 'lock';
          break;
        case 'pending':
          label = 'warning';
          break;
        default:
          label = '';
          break;
      }
    }
    return label;
  }
}
