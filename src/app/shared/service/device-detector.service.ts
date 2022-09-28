import { PLATFORM_ID, Inject, Injectable, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';
import { IDeviceInfo } from '@shared/interface';

/**
 *
 */
const BROWSERS: any = {
  CHROME: 'Chrome',
  FIREFOX: 'Firefox',
  SAFARI: 'Safari',
  OPERA: 'Opera',
  IE: 'IE',
  MS_EDGE: 'MS-Edge',
  FB_MESSANGER: 'FB-Messanger',
  SAMSUNG: 'Samsung',
  UCBROWSER: 'UC-Browser',
  UNKNOWN: 'Unknown'
};

/**
 *
 */
const DEVICES: any = {
  ANDROID: 'Android',
  I_PAD: 'iPad',
  IPHONE: 'iPhone',
  I_POD: 'iPod',
  BLACKBERRY: 'Blackberry',
  FIREFOX_OS: 'Firefox-OS',
  CHROME_BOOK: 'Chrome-Book',
  WINDOWS_PHONE: 'Windows-Phone',
  PS4: 'PS4',
  VITA: 'Vita',
  CHROMECAST: 'Chromecast',
  APPLE_TV: 'Apple-TV',
  GOOGLE_TV: 'Google-TV',
  UNKNOWN: 'Unknown'
};

/**
 *
 */
const OS: any = {
  WINDOWS: 'Windows',
  MAC: 'Mac',
  IOS: 'iOS',
  ANDROID: 'Android',
  LINUX: 'Linux',
  UNIX: 'Unix',
  FIREFOX_OS: 'Firefox-OS',
  CHROME_OS: 'Chrome-OS',
  WINDOWS_PHONE: 'Windows-Phone',
  UNKNOWN: 'Unknown'
};

/**
 *
 */
const OS_VERSIONS: any = {
  WINDOWS_3_11: 'windows-3-11',
  WINDOWS_95: 'windows-95',
  WINDOWS_ME: 'windows-me',
  WINDOWS_98: 'windows-98',
  WINDOWS_CE: 'windows-ce',
  WINDOWS_2000: 'windows-2000',
  WINDOWS_XP: 'windows-xp',
  WINDOWS_SERVER_2003: 'windows-server-2003',
  WINDOWS_VISTA: 'windows-vista',
  WINDOWS_7: 'windows-7',
  WINDOWS_8_1: 'windows-8-1',
  WINDOWS_8: 'windows-8',
  WINDOWS_10: 'windows-10',
  WINDOWS_PHONE_7_5: 'windows-phone-7-5',
  WINDOWS_PHONE_8_1: 'windows-phone-8-1',
  WINDOWS_PHONE_10: 'windows-phone-10',
  WINDOWS_NT_4_0: 'windows-nt-4-0',
  MACOSX_15: 'mac-os-x-15',
  MACOSX_14: 'mac-os-x-14',
  MACOSX_13: 'mac-os-x-13',
  MACOSX_12: 'mac-os-x-12',
  MACOSX_11: 'mac-os-x-11',
  MACOSX_10: 'mac-os-x-10',
  MACOSX_9: 'mac-os-x-9',
  MACOSX_8: 'mac-os-x-8',
  MACOSX_7: 'mac-os-x-7',
  MACOSX_6: 'mac-os-x-6',
  MACOSX_5: 'mac-os-x-5',
  MACOSX_4: 'mac-os-x-4',
  MACOSX_3: 'mac-os-x-3',
  MACOSX_2: 'mac-os-x-2',
  MACOSX: 'mac-os-x',
  UNKNOWN: 'unknown'
};

/**
 *
 */
const OS_REGEXP: any = {
  WINDOWS: {
    and: [
      { or: [/\bWindows|(Win\d\d)\b/, /\bWin 9x\b/] },
      { not: /\bWindows Phone\b/ }
    ]
  },
  MAC: {
    and: [/\bMac OS\b/, { not: { or: [/\biPhone\b/, /\bWindows Phone\b/] } }]
  },
  IOS: {
    and: [
      { or: [/\biPad\b/, /\biPhone\b/, /\biPod\b/] },
      { not: /\bWindows Phone\b/ }
    ]
  },
  ANDROID: { and: [/\bAndroid\b/, { not: /\bWindows Phone\b/ }] },
  LINUX: /\bLinux\b/,
  UNIX: /\bUNIX\b/,
  FIREFOX_OS: { and: [/\bFirefox\b/, /Mobile\b/] },
  CHROME_OS: /\bCrOS\b/,
  WINDOWS_PHONE: { or: [/\bIEMobile\b/, /\bWindows Phone\b/] },
  PS4: /\bMozilla\/5.0 \(PlayStation 4\b/,
  VITA: /\bMozilla\/5.0 \(Play(S|s)tation Vita\b/
};

/**
 *
 */
const BROWSERS_REGEXP: any = {
  CHROME: {
    and: [
      { or: [/\bChrome\b/, /\bCriOS\b/] },
      {
        not: {
          or: [
            /\bOPR\b/,
            /\bEdg(e|A|iOS)\b/,
            /\bSamsungBrowser\b/,
            /\bUCBrowser\b/
          ]
        }
      }
    ]
  },
  FIREFOX: { or: [/\bFirefox\b/, /\bFxiOS\b/] },
  SAFARI: {
    and: [
      /^((?!CriOS).)*\Safari\b.*$/,
      {
        not: {
          or: [
            /\bOPR\b/,
            /\bEdg(e|A|iOS)\b/,
            /\bWindows Phone\b/,
            /\bSamsungBrowser\b/,
            /\bUCBrowser\b/
          ]
        }
      }
    ]
  },
  OPERA: { or: [/Opera\b/, /\bOPR\b/] },
  IE: {
    or: [
      /\bMSIE\b/,
      /\bTrident\b/,
      /^Mozilla\/5\.0 \(Windows NT 10\.0; Win64; x64\)$/
    ]
  },
  MS_EDGE: { or: [/\bEdg(e|A|iOS)\b/] },
  PS4: /\bMozilla\/5.0 \(PlayStation 4\b/,
  VITA: /\bMozilla\/5.0 \(Play(S|s)tation Vita\b/,
  FB_MESSANGER: /\bFBAN\/MessengerForiOS\b/,
  SAMSUNG: /\bSamsungBrowser\b/,
  UCBROWSER: /\bUCBrowser\b/
};

/**
 *
 */
const DEVICES_REGEXP: any = {
  ANDROID: { and: [/\bAndroid\b/, { not: /Windows Phone/ }] },
  I_PAD: /\biPad\b/,
  IPHONE: { and: [/\biPhone\b/, { not: /Windows Phone/ }] },
  I_POD: /\biPod\b/,
  BLACKBERRY: /\bblackberry\b/,
  FIREFOX_OS: { and: [/\bFirefox\b/, /\bMobile\b/] },
  CHROME_BOOK: /\bCrOS\b/,
  WINDOWS_PHONE: { or: [/\bIEMobile\b/, /\bWindows Phone\b/] },
  PS4: /\bMozilla\/5.0 \(PlayStation 4\b/,
  CHROMECAST: /\bCrKey\b/,
  APPLE_TV: /^iTunes-AppleTV\/4.1$/,
  GOOGLE_TV: /\bGoogleTV\b/,
  VITA: /\bMozilla\/5.0 \(Play(S|s)tation Vita\b/
};

/**
 *
 */
const OS_VERSIONS_REGEXP: any = {
  WINDOWS_3_11: /Win16/,
  WINDOWS_95: /(Windows 95|Win95|Windows_95)/,
  WINDOWS_ME: /(Win 9x 4.90|Windows ME)/,
  WINDOWS_98: /(Windows 98|Win98)/,
  WINDOWS_CE: /Windows CE/,
  WINDOWS_2000: /(Windows NT 5.0|Windows 2000)/,
  WINDOWS_XP: /(Windows NT 5.1|Windows XP)/,
  WINDOWS_SERVER_2003: /Windows NT 5.2/,
  WINDOWS_VISTA: /Windows NT 6.0/,
  WINDOWS_7: /(Windows 7|Windows NT 6.1)/,
  WINDOWS_8_1: /(Windows 8.1|Windows NT 6.3)/,
  WINDOWS_8: /(Windows 8|Windows NT 6.2)/,
  WINDOWS_10: /(Windows NT 10.0)/,
  WINDOWS_PHONE_7_5: /(Windows Phone OS 7.5)/,
  WINDOWS_PHONE_8_1: /(Windows Phone 8.1)/,
  WINDOWS_PHONE_10: /(Windows Phone 10)/,
  WINDOWS_NT_4_0: {
    and: [
      /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
      { not: /Windows NT 10.0/ }
    ]
  },
  MACOSX: /(MAC OS X\s*[^ 0-9])/,
  MACOSX_3: /(Darwin 10.3|Mac OS X 10.3)/,
  MACOSX_4: /(Darwin 10.4|Mac OS X 10.4)/,
  MACOSX_5: /(Mac OS X 10.5)/,
  MACOSX_6: /(Mac OS X 10.6)/,
  MACOSX_7: /(Mac OS X 10.7)/,
  MACOSX_8: /(Mac OS X 10.8)/,
  MACOSX_9: /(Mac OS X 10.9)/,
  MACOSX_10: /(Mac OS X 10.10)/,
  MACOSX_11: /(Mac OS X 10.11)/,
  MACOSX_12: /(Mac OS X 10.12)/,
  MACOSX_13: /(Mac OS X 10.13)/,
  MACOSX_14: /(Mac OS X 10.14)/,
  MACOSX_15: /(Mac OS X 10.15)/
};

/**
 *
 */
const BROWSER_VERSIONS_REGEXP_MAP: any = {
  CHROME: [/\bChrome\/([\d\.]+)\b/, /\bCriOS\/([\d\.]+)\b/],
  FIREFOX: /\bFirefox\/([\d\.]+)\b/,
  SAFARI: /\bVersion\/([\d\.]+)\b/,
  OPERA: [/\bVersion\/([\d\.]+)\b/, /\bOPR\/([\d\.]+)\b/],
  IE: [/\bMSIE ([\d\.]+\w?)\b/, /\brv:([\d\.]+\w?)\b/],
  MS_EDGE: /\bEdg(?:e|A|iOS)\/([\d\.]+)\b/,
  SAMSUNG: /\bSamsungBrowser\/([\d\.]+)\b/,
  UCBROWSER: /\bUCBrowser\/([\d\.]+)\b/
};

/**
 *
 */
const BROWSER_VERSIONS_REGEXP: any = _.keys(BROWSER_VERSIONS_REGEXP_MAP).reduce(
  (obj: any, key: any) => {
    obj[BROWSERS[key]] = BROWSER_VERSIONS_REGEXP_MAP[key];
    return obj;
  },
  {}
);

/**
 *
 */
const CONSTANTS: any = {
  DEVICES: DEVICES,
  DEVICES_REGEXP: DEVICES_REGEXP,
  BROWSERS: BROWSERS,
  BROWSERS_REGEXP: BROWSERS_REGEXP,
  OS: OS,
  OS_REGEXP: OS_REGEXP,
  OS_VERSIONS: OS_VERSIONS,
  OS_VERSIONS_REGEXP: OS_VERSIONS_REGEXP,
  BROWSER_VERSIONS_REGEXP_MAP: BROWSER_VERSIONS_REGEXP_MAP,
  BROWSER_VERSIONS_REGEXP: BROWSER_VERSIONS_REGEXP
};

/**
 * Created by ahsanayaz on 08/11/2016.
 */

class RegexRecursive {
  /**
   *
   *
   * @static
   * @param {string} string
   * @param {*} regex
   * @returns {*}
   * @memberof RegexRecursive
   */
  static test(str: string, regex: any): any {
    if (_.isString(regex)) {
      regex = new RegExp(regex);
    }
    if (_.isRegExp(regex)) {
      return regex.test(str);
    }
    if (_.has(regex, 'and') && _.isArray(regex.and)) {
      return regex.and.every((item: any) => RegexRecursive.test(str, item));
    }
    if (_.has(regex, 'or') && _.isArray(regex.or)) {
      return regex.or.some((item: any) => RegexRecursive.test(str, item));
    }
    if (_.has(regex, 'not')) {
      return !RegexRecursive.test(str, regex.not);
    }

    return false;
  }

  /**
   *
   *
   * @param {string} string
   * @param {*} regex
   * @returns {*}
   * @memberof RegexRecursive
   */
  static exec(string: string, regex: any): any {
    if (_.isString(regex)) {
      regex = new RegExp(regex);
    }
    if (_.isRegExp(regex)) {
      return regex.exec(string);
    }
    if (_.isArray(regex)) {
      return regex.reduce(
        (res: any, item: any) =>
          !!res ? res : RegexRecursive.exec(string, item),
        null
      );
    }

    return null;
  }
}

/**
 *
 *
 * @export
 * @class DeviceDetectorService
 */
@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _ua: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _userAgent: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _os: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _browser: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _device: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _osVersion: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof DeviceDetectorService
   */
  private _browserVersion: string = '';

  /**
   *Creates an instance of DeviceDetectorService.
   * @param {*} platformId
   * @memberof DeviceDetectorService
   */
  constructor(@Inject(PLATFORM_ID) private platformId) {
    if (isPlatformBrowser(this.platformId)) {
      this._ua = window.navigator.userAgent;
    }
    this._setDeviceInfo();
  }

  /**
   *
   *
   * @memberof DeviceDetectorService
   */
  public ngOnDestroy() {}

  /**
   * @desc Sets the initial value of the device when the service is initiated.
   * This value is later accessible for usage
   */
  private _setDeviceInfo(): void {
    const ua: string = this._ua;
    this._userAgent = ua;
    const mappings = [
      { key: 'OS', value: '_os' },
      { key: 'BROWSERS', value: '_browser' },
      { key: 'DEVICES', value: '_device' },
      { key: 'OS_VERSIONS', value: '_osVersion' }
    ];
    mappings.forEach(mapping => {
      this[mapping.value] = _.keys(CONSTANTS[mapping.key]).reduce(
        (key: any, value: any) => {
          key[CONSTANTS[mapping.key][value]] = RegexRecursive.test(
            ua,
            CONSTANTS[`${mapping.key}_REGEXP`][value]
          );
          return key;
        },
        {}
      );
    });
    mappings.forEach(mapping => {
      this[mapping.value] = _.keys(CONSTANTS[mapping.key])
        .map(key => CONSTANTS[mapping.key][key])
        .reduce(
          (previousValue, currentValue) =>
            previousValue === CONSTANTS[mapping.key].UNKNOWN &&
            this[mapping.value][currentValue]
              ? currentValue
              : previousValue,
          CONSTANTS[mapping.key].UNKNOWN
        );
    });
    this._browserVersion = '0';
    if (this._browser !== CONSTANTS.BROWSERS.UNKNOWN) {
      const re = CONSTANTS.BROWSER_VERSIONS_REGEXP[this._browser];
      const result = RegexRecursive.exec(ua, re);
      if (!!result) {
        this._browserVersion = result[1];
      }
    }
  }

  /**
   * @desc Returns the device information
   * @returns the device information object.
   */
  public get deviceInfo(): IDeviceInfo {
    const deviceInfo: IDeviceInfo = {
      userAgent: this._userAgent,
      os: this._os,
      browser: this._browser,
      device: this._device,
      osVersion: this._osVersion,
      browserVersion: this._browserVersion
    };

    return deviceInfo;
  }

  /**
   *
   * @description Compares the current device info with the mobile devices to check, if the current device is a mobile.
   * @readonly
   * @type {boolean}
   * @returns {boolean} whether the current device is a mobile
   * @memberof DeviceDetectorService
   */
  public get isMobile(): boolean {
    return [
      CONSTANTS.DEVICES.ANDROID,
      CONSTANTS.DEVICES.IPHONE,
      CONSTANTS.DEVICES.I_POD,
      CONSTANTS.DEVICES.BLACKBERRY,
      CONSTANTS.DEVICES.FIREFOX_OS,
      CONSTANTS.DEVICES.WINDOWS_PHONE,
      CONSTANTS.DEVICES.VITA
    ].some(item => this._device === item);
  }

  /**
   *
   *
   * @readonly
   * @description Compares the current device info with the tablet devices to check, if the current device is a tablet.
   * @type {boolean}
   * @returns {boolean} whether the current device is a tablet
   * @memberof DeviceDetectorService
   */
  public get isTablet(): boolean {
    return [CONSTANTS.DEVICES.I_PAD, CONSTANTS.DEVICES.FIREFOX_OS].some(
      item => this._device === item
    );
  }

  /**
   *
   * @description Compares the current device info with the desktop devices to check, if the current device is a desktop device.
   * @readonly
   * @type {boolean}
   * @returns {boolean} whether the current device is a desktop device
   * @memberof DeviceDetectorService
   */
  public get isDesktop(): boolean {
    return [
      CONSTANTS.DEVICES.PS4,
      CONSTANTS.DEVICES.CHROME_BOOK,
      CONSTANTS.DEVICES.UNKNOWN
    ].some(item => this._device === item);
  }
}
