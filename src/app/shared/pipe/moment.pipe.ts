import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @class MomentPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  /**
   *
   *
   * @param {MomentInput} value
   * @param {string} [format='YYYY-MM-DD HH:mm:ss']
   * @returns {string}
   * @memberof MomentPipe
   */
  public transform(
    value: MomentInput,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    if (_.isNull(value) || _.isUndefined(value)) {
      value = new Date();
    }

    if (_.isString(value)) {
      value = new Date(value);
    }

    return moment(value).format(format);
  }
}
