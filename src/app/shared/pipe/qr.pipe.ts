import { environment } from '@env/environment';
import { Pipe, PipeTransform } from '@angular/core';

/**
 *
 * @see https://developers.google.com/chart/infographics/docs/qr_codes
 * @export
 * @class QrPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'qr'
})
export class QrPipe implements PipeTransform {
  /**
   *
   *
   * @param {string} value
   * @param {number} [args=128]
   * @returns {string}
   * @memberof QrPipe
   */
  public transform(value: string, args: number = 128): string {
    return `${
      environment.google.chart.url
    }?chs=${args}x${args}&cht=qr&chl=${value}`;
  }
}
