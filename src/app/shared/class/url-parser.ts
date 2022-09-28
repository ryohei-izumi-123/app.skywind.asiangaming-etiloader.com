import * as Parser from 'url-parse';
import { IUrlSchema } from '@shared/interface';

/**
 *
 *
 * @export
 * @class UrlParser
 */
export class UrlParser {
  /**
   *
   * @static
   * @param {string} url
   * @param {boolean} [isDeep=true]
   * @returns {IUrlSchema}
   * @memberof AppUrlParser
   */
  public static parse(url: string, isDeep = true): IUrlSchema {
    return <IUrlSchema>Parser(url, isDeep);
  }
}
