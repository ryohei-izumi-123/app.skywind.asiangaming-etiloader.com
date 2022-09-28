import { Pipe, PipeTransform } from '@angular/core';
import {
  humanize,
  pluralize,
  singularize,
  underscore,
  camelize,
  titleize,
  tableize,
  classify,
  dasherize,
  foreignKey,
  ordinal,
  ordinalize,
  transliterate,
  parameterize
} from 'inflected';
import * as _ from 'lodash';

/**
 *
 * @export
 * @class InflectorPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'inflector'
})
export class InflectorPipe implements PipeTransform {
  /**
   *
   *
   * @param {string} value
   * @param {'humanize'|'pluralize'|'singularize'|'underscore'|'camelize'|'titleize'|'tableize'|'classify'|'dasherize'|'foreignKey'|'ordinal'|'ordinalize'|'transliterate'|'parameterize'} [args]
   * @returns {string}
   * @memberof InflectorPipe
   */
  public transform(
    value: string,
    args:
      | 'humanize'
      | 'pluralize'
      | 'singularize'
      | 'underscore'
      | 'camelize'
      | 'titleize'
      | 'tableize'
      | 'classify'
      | 'dasherize'
      | 'foreignKey'
      | 'ordinal'
      | 'ordinalize'
      | 'transliterate'
      | 'parameterize' = 'humanize'
  ): string {
    switch (_.toLower(args)) {
      case 'humanize':
        return humanize(value);

      case 'pluralize':
        return pluralize(value);

      case 'singularize':
        return singularize(value);

      case 'underscore':
        return underscore(value);

      case 'camelize':
        return camelize(value);

      case 'titleize':
        return titleize(value);

      case 'tableize':
        return tableize(value);

      case 'classify':
        return classify(value);

      case 'dasherize':
        return dasherize(value);

      case 'foreignKey':
        return foreignKey(value);

      case 'ordinal':
        return ordinal(_.toNumber(value));

      case 'ordinalize':
        return ordinalize(_.toNumber(value));

      case 'transliterate':
        return transliterate(value);

      case 'parameterize':
        return parameterize(value);

      case 'initialize':
        return _.toString(value).charAt(0);
    }

    return _.toString(args);
  }
}
