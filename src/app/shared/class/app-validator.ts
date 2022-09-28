import { environment } from '@env/environment';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

/**
 *
 *
 * @export
 * @class AppValidator
 */
export class AppValidator {
  /**
   *
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isDate(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^¥d+$/);
    const error: ValidationErrors = { isDate: true };
    if (!_.isEmpty(ctrl.value)) {
      return moment(ctrl.value).isValid() ? null : error;
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isTime(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(
      /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
    );
    const error: ValidationErrors = { isTime: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 全角・半角数字のみ
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isNumberLike(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^¥d+$/);
    const error: ValidationErrors = { isNumberLike: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 半角数字のみ
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isNumber(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^[0-9]+$/);
    const error: ValidationErrors = { isNumber: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 半角英字小文字のみ
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isAlphaLower(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^[a-z]+$/);
    const error: ValidationErrors = { isAlphaLower: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 半角英字大文字のみ
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isAlphaUpper(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^[A-Z]+$/);
    const error: ValidationErrors = { isAlphaUpper: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 半角英数字のみ
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isAlphaNum(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^[a-zA-Z0-9]+$/);
    const error: ValidationErrors = { isAlphaNum: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 半角英字のみ
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isAlpha(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/^[a-zA-Z]+$/);
    const error: ValidationErrors = { isAlpha: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 記号文字
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isSymbol(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(
      /[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/g
    );
    const error: ValidationErrors = { isSymbol: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isNoSymbol(ctrl: AbstractControl): ValidationErrors {
    const error: ValidationErrors = { isNoSymbol: true };
    if (!_.isEmpty(ctrl.value)) {
      return null === AppValidator.isSymbol(ctrl) ? error : null;
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isJpMobilePhone(ctrl: AbstractControl): ValidationErrors {
    // const regex: RegExp = new RegExp(/^\d{3}-\d{4}-\d{4}$/);
    const regex: RegExp = new RegExp(/^[0-9-]+$/);
    const error: ValidationErrors = { isJpMobilePhone: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 半角英大文字、半角英小文字、半角数字、記号のうち、いずれか３種類を含む８文字以上の文字列
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isStrongPassword(ctrl: AbstractControl): ValidationErrors {
    const getMaxLength: Function = (): number => {
      let max: number = 0;
      if (
        ctrl.errors &&
        ctrl.errors.maxlength &&
        ctrl.errors.maxlength.requiredLength
      ) {
        max = Number(ctrl.errors.maxlength.requiredLength);
      }

      return max;
    };
    const maxLength: number = getMaxLength();
    const regex: RegExp = new RegExp(
      '^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!-/:-@\\[-`{-~])|(?=.*[a-z])(?=.*[0-9])(?=.*[!-/:-@\\[-`{-~])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!-/:-@\\[-`{-~]))[a-zA-Z0-9!-/:-@\\[-`{-~]{' +
        maxLength +
        ',}$'
    );
    const error: ValidationErrors = { isStrongPassword: true };
    if (
      !_.isEmpty(ctrl.value) &&
      null === AppValidator.isValidPasswordChar(ctrl) &&
      String(ctrl.value).length >= maxLength
    ) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @param {AbstractControl} compareWith
   * @returns {ValidatorFn}
   * @memberof AppValidator
   */
  public static isSamePassword(compareWith: AbstractControl): ValidatorFn {
    return (ctrl: AbstractControl): { [key: string]: any } => {
      const error: ValidationErrors = { isSamePassword: true };
      if (!_.isEmpty(ctrl.value)) {
        return ctrl.value === compareWith.value ? null : error;
      }

      return null;
    };
  }

  /**
   * 半角
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isHalfSize(ctrl: AbstractControl): ValidationErrors {
    const error: ValidationErrors = { isHalfSize: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== AppValidator.isFullSize(ctrl) ? null : error;
    }

    return null;
  }

  /**
   * 全角
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isFullSize(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/[\u3040-\u30ff]/);
    const error: ValidationErrors = { isFullSize: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 空白を含む
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isNoSpace(ctrl: AbstractControl): ValidationErrors {
    // const regex: RegExp = new RegExp(/[　+]/);
    const regex: RegExp = new RegExp(/[\s]/);
    const error: ValidationErrors = { isNoSpace: true };
    if (!_.isEmpty(ctrl.value)) {
      return ctrl.value.trim().length &&
        ctrl.value.trim().length === ctrl.value.length
        ? null
        : error;
      // && null === ctrl.value.match(RegExp) ? null : error;
    }

    return null;
  }

  /**
   *パスワードに使用できる文字か？
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isValidPasswordChar(ctrl: AbstractControl): ValidationErrors {
    const error: ValidationErrors = { isValidPasswordChar: true };
    if (!_.isEmpty(ctrl.value)) {
      return null === AppValidator.isNoSpace(ctrl) &&
        null === AppValidator.isHalfSize(ctrl)
        ? null
        : error;
    }

    return null;
  }

  /**
   * ASCII文字が含まれる
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isAscii(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/[\u0020-\u007e]/);
    const error: ValidationErrors = { isAscii: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * 特定の記号が含まれる
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isSpecialChars(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/(<|>|&|"|'|\u005c|\u0020)/);
    const error: ValidationErrors = { isSpecialChars: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * ひらがなが含まれる
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isHiragana(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/[\u3040-\u309f]/);
    const error: ValidationErrors = { isHiragana: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   * カタカナが含まれる
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isKatakana(ctrl: AbstractControl): ValidationErrors {
    const regex: RegExp = new RegExp(/[\u30a0-\u30ff]/);
    const error: ValidationErrors = { isKatakana: true };
    if (!_.isEmpty(ctrl.value)) {
      return null !== ctrl.value.match(regex) ? null : error;
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isValidFile(ctrl: AbstractControl): ValidationErrors {
    const error: ValidationErrors = { isValidFile: true };
    let file: File;
    let size: number;
    if (!_.isEmpty(ctrl.value) && _.isArray(ctrl.value)) {
      const [$0]: File[] = ctrl.value;
      file = $0;
      size = file.size;
      return size ? null : error;
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @memberof AppValidator
   */
  public static isValidFileSize = (
    max: number = environment.threshold.fileMaxSize
  ): ValidatorFn => {
    return (ctrl: AbstractControl): ValidationErrors | null => {
      const error: ValidationErrors = { isValidFileSize: true };
      let file: File;
      let size: number;
      if (!_.isEmpty(ctrl.value) && _.isArray(ctrl.value)) {
        const [$0]: File[] = ctrl.value;
        file = $0;
        size = file.size;

        return max > size ? null : error;
      }

      return null;
    };
  };

  /**
   *
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns {ValidationErrors}
   * @memberof AppValidator
   */
  public static isValidFileExtension(ctrl: AbstractControl): ValidationErrors {
    const regex = new RegExp(/(.*?)\.(jpg|png|jpeg|gif)$/);
    const error: ValidationErrors = { isValidFileExtension: true };
    let file: File;
    let name: string;
    if (!_.isEmpty(ctrl.value) && _.isArray(ctrl.value)) {
      const [$0]: File[] = ctrl.value;
      file = $0;
      name = String(file.name).toLowerCase();

      return null !== name.match(regex) ? null : error;
    }

    return null;
  }
}
