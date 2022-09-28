import { Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'bignumber.js';
import { TIso4217 } from '@shared/type';

/**
 *
 *
 * @export
 * @class CurrencyPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  /**
   *
   *
   * @param {(number|string)} value
   * @param {number} [decimalScale=2]
   * @param {TIso4217} iso4127
   * @returns {string}
   * @memberof CurrencyPipe
   */
  public transform(
    value: number | string,
    decimalScale: number = 0,
    iso4127: TIso4217 = 'JPY'
  ): string {
    const symbol: string = iso4127 === 'USD' ? '$' : '¥';
    return `${symbol}${new BigNumber(value).toFixed(decimalScale)}`;
  }
}
