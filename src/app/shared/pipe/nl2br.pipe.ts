import { Inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 *
 * @usage `[innerHTML]="text|nl2br"`
 * @export
 * @class Nl2brPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'nl2br'
})
export class Nl2brPipe implements PipeTransform {
  /**
   *
   *
   * @private
   * @type {string}
   * @memberof Nl2brPipe
   */
  private _br: string = '<br />';

  /**
   *Creates an instance of Nl2brPipe.
   * @param {DomSanitizer} _domSanitizer
   * @memberof Nl2brPipe
   */
  constructor(@Inject(DomSanitizer) private _domSanitizer: DomSanitizer) {}

  /**
   *
   *
   * @param {string} value
   * @param {string} [args]
   * @returns {(SafeHtml|string)}
   * @memberof Nl2brPipe
   */
  public transform(value: string, args?: string): SafeHtml | string {
    if (value) {
      return <SafeHtml>(
        this._domSanitizer.bypassSecurityTrustHtml(
          `${value}`.replace(/(?:\r\n|\r|\n)/g, this._br)
        )
      );
    }

    return value;
  }
}
