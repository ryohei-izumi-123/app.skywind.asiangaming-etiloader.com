import { Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'bignumber.js';

/**
 *
 *
 * @export
 * @class BignumberPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'bignumber'
})
export class BignumberPipe implements PipeTransform {
  /**
   *
   *
   * @param {(number|string)} value
   * @param {number} [decimalScale=2]
   * @returns {string}
   * @memberof BignumberPipe
   */
  public transform(value: number | string, decimalScale: number = 2): string {
    return new BigNumber(value).toFixed(decimalScale);
  }
}
