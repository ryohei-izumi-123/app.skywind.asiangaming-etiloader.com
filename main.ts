import {
  app as App,
  protocol as Protocol,
  dialog as Dialog,
  ipcMain as IpcMain,
  IpcMainEvent,
  nativeImage as NativeImage,
  Tray,
  Menu,
  BrowserWindow,
  DownloadItem,
  BrowserWindowConstructorOptions,
  webContents as WebContents,
  shell as Shell,
  session as Session,
  globalShortcut as GlobalShortcut,
  Referrer,
  WebPreferences,
  AutoUpdater,
  DefaultFontFamily,
  Rectangle,
  Cookie,
  MessageBoxSyncOptions,
  MenuItemConstructorOptions,
  OnBeforeRequestDetails,
  OnBeforeRequestFilter,
  Accelerator,
  UploadData,
  crashReporter as CrashReporter
} from 'electron';
import { autoUpdater } from 'electron-updater';
import * as RunAsDev from 'electron-is-dev';
import * as Log from 'electron-log';
import * as Store from 'electron-store';
import * as LocalShortcut from 'electron-localshortcut';
import * as Superagent from 'superagent';
import * as Path from 'path';
import * as Fs from 'fs';
import { URL, format as URLFormatter, URLSearchParams } from 'url';
import * as _ from 'lodash';
import * as BaseConfig from 'electron-node-config';
import * as Sentry from '@sentry/electron';
import { promisify as Promisify } from 'util';
import * as process from 'process';
import * as Dotenv from 'dotenv';

/**
 *
 *
 * @type TEnv
 */
declare type TEnv = 'development' | 'staging' | 'production';

/**
 *
 *
 * @interface IURL
 */
declare interface IURL {
  hash?: string;
  host?: string;
  hostname?: string;
  href?: string;
  readonly origin?: string;
  username?: string;
  password?: string;
  pathname?: string;
  port?: string;
  protocol?: string;
  search?: string;
  readonly searchParams?: URLSearchParams;
  toString?: () => string;
  toJSON?: () => string;
}

/**
 *
 *
 * @interface ILocales
 */
declare interface ILocales {
  EN?: any;
  JA?: any;
}

/**
 *
 *
 * @type ILocale
 */
declare type ILocale = keyof ILocales;

/**
 *
 *
 * @interface IFeedURLOptions
 */
declare interface IFeedURLOptions {
  provider?: string;
  url?: string;
}

/**
 *
 *
 * @type ILanguage
 */
declare type ILanguage = 'en' | 'ja';

/**
 *
 *
 * @type IAcceleratorAlias
 */
declare type IAcceleratorAlias =
  | 'QUIT'
  | 'RELOAD'
  | 'FORCE-RELOAD'
  | 'DEBUG'
  | 'FLUSH';

/**
 *
 *
 * @interface ICredentials
 */
declare interface ICredentials {
  playerCode?: string;
  password?: string;
  token?: string;
}

/**
 *
 *
 * @interface IUserConfig
 */
declare interface IUserConfig {
  state?: IState;
  bounds?: Rectangle;
}

/**
 *
 * @interface IStateSound
 */
declare interface IStateSound {
  bgm: boolean;
  se: boolean;
  volume: number;
}

/**
 *
 * @interface IGamePayload
 */
declare interface IGamePayload extends IStateSound {
  gameCode?: string;
  title?: string;
  url: string;
}

/**
 *
 * @interface IDialogPayload
 */
declare interface IDialogPayload extends IStateSound {
  message?: string;
}

/**
 *
 * @interface INetworkStatusPayload
 */
declare interface INetworkStatusPayload {
  status: boolean;
}

/**
 *
 * @interface ISetEnvPayload
 */
declare interface ISetEnvPayload {
  env: TEnv;
}

/**
 *
 *
 * @interface IState
 */
declare interface IState {
  sound: IStateSound;
  isServe: boolean;
  isReady: boolean;
  isLogin: boolean;
  networkStatus: boolean;
  credentials: Partial<ICredentials>;
  isAskingExit: boolean;
}

/**
 *
 *
 * @interface IAutoUpdater
 */
declare interface IAutoUpdater extends AutoUpdater {
  checkForUpdatesAndNotify: any;
  logger: any;
  allowDowngrade: boolean;
  autoDownload: boolean;
  autoInstallOnAppQuit: boolean;
  updateConfigPath: string;
  downloadUpdate: () => Promise<any>;
}

/**
 *
 *
 * @interface IWindows
 */
declare interface IWindows {
  main: BrowserWindow;
  playcheck: BrowserWindow;
  updater: BrowserWindow;
  games: Map<string, BrowserWindow>;
}

/**
 *
 *
 * @interface ISentryOptions
 */
declare interface ISentryOptions {
  dsn: string;
  api: string;
}

/**
 *
 *
 * @interface ICommonOptions
 */
declare interface ICommonOptions {
  locale: ILocale;
  language: ILanguage;
  maxGameWindows: number;
  logo: string;
  icon: string;
}

/**
 *
 *
 * @interface IHostsOptions
 */
declare interface IHostsOptions {
  base: string;
  game: string;
  live: string;
}

/**
 *
 *
 * @interface IHostOptions
 */
declare interface IHostOptions {
  base: string;
  game: string[];
  live: string[];
}

/**
 *
 *
 * @interface IFileOptions
 */
declare interface IFileOptions {
  index: string;
  update: string;
}

/**
 *
 *
 * @interface IUrlOptions
 */
declare interface IUrlOptions {
  base: string;
  feed: string;
  error: string;
}

/**
 *
 *
 * @interface INetworkOptions
 */
declare interface INetworkOptions {
  proxy?: string;
}

/**
 *
 *
 * @interface IUpdateOptions
 */
declare interface IUpdateOptions {
  autoUpdate: boolean;
  autoDownload: boolean;
  provider: 'electron-updater' | 'electron';
}

/**
 *
 *
 * @interface IShortcutOptions
 */
declare interface IShortcutOptions {
  useGlobal: boolean;
}

/**
 *
 *
 * @interface IOptions
 */
declare interface IOptions {
  env: TEnv;
  version?: string;
  sentry: ISentryOptions;
  common: ICommonOptions;
  host: IHostOptions;
  file: IFileOptions;
  url: IUrlOptions;
  network: INetworkOptions;
  update: IUpdateOptions;
  shortcut: IShortcutOptions;
}

/**
 *
 *
 * @interface IFilter
 */
declare interface IFilter {
  url?: string;
  name?: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  session?: boolean;
}

/**
 *
 *
 * @declare
 * @interface ITranslateReplacement
 */
declare interface ITranslateReplacement {
  [key: string]: string;
}

/**
 *
 *
 * @declare
 * @interface INewBrowserWindowEvent
 */
declare interface INewBrowserWindowEvent extends Event {
  newGuest: BrowserWindow;
}

/**
 *
 *
 * @interface ILoadEvent
 */
declare interface ILoadEvent extends Event {
  sender?: WebContents;
}

/**
 *
 *
 * @interface IUpdateAvailableEvent
 */
declare interface IUpdateAvailableEvent extends Event {
  version?: string;
  files?: string[];
  path?: string;
  sha512?: string;
  releaseDate?: string | Date;
}

/**
 *
 *
 * @interface IBrowserWindowEvent
 */
declare interface IBrowserWindowEvent extends Event {
  sender?: BrowserWindow;
}

/**
 *
 *
 * @type TNoop
 */
declare type TNoop = (arg?: any) => void;

const NOOP: TNoop = (arg?: any) => undefined;
const LOCALES: ILocales = {
  EN: {
    MENU: 'MENU',
    ERROR_APP_HAS_ALREADY_BEEN_RUNNING: 'Application has already been running!',
    ERROR_APP_UNRESPOND: 'Application does not respond',
    ERROR_LIMIT_MAX_GAME_WINDOWS:
      'The maximum number of games that can be opened simultaneously is {{maxGameWindows}}.',
    NO: 'No',
    YES: 'Yes',
    OK: 'OK',
    ERROR: 'Error!',
    CONFIRM: 'Confirmation',
    EXIT: 'Exit',
    MSG_TO_ASK_EXIT: 'Are you sure you want to quit the application?',
    ERROR_ON_UPDATE: 'Error on update!',
    NEW_UPDATE: 'New version is available.',
    INSTALL_WITH_RESTART: 'After installation, it will automatically restart.',
    RESTART: 'Restart',
    UPDATE: 'Update',
    HISTORY: 'Game History',
    CACHE_CLEAR: 'cache has been cleared successfully.'
  },
  JA: {
    MENU: 'メニュー',
    ERROR_APP_HAS_ALREADY_BEEN_RUNNING: '既に起動しています。',
    ERROR_APP_UNRESPOND: 'アプリケーションは応答していません。終了しますか？',
    ERROR_LIMIT_MAX_GAME_WINDOWS:
      '同時に開ける最大ゲーム数は{{maxGameWindows}}です。',
    NO: 'いいえ',
    YES: 'はい',
    OK: 'OK',
    ERROR: 'エラー',
    CONFIRM: '確認',
    EXIT: '終了',
    MSG_TO_ASK_EXIT: '終了しますか？',
    ERROR_ON_UPDATE: 'アップデート中にエラーが発生しました。',
    NEW_UPDATE: '新しいバージョンがあります。',
    INSTALL_WITH_RESTART: '再起動してインストール可能です。',
    RESTART: '再起動',
    UPDATE: 'アップデート',
    HISTORY: 'ゲーム履歴',
    CACHE_CLEAR: 'キャッシュをクリアしました。'
  }
};

/**
 *
 *
 * @class Main
 */
class Main {
  /**
   *
   *
   * @private
   * @type {(Map<IAcceleratorAlias, Accelerator>)}
   * @memberof Main
   */
  private accelerators: Map<IAcceleratorAlias, Accelerator> = new Map([
    ['QUIT', 'CmdOrCtrl+Q'],
    ['RELOAD', 'CmdOrCtrl+R'],
    ['DEBUG', 'CommandOrControl+Option+D'],
    ['FORCE-RELOAD', 'F5'],
    ['FLUSH', 'CommandOrControl+Option+F']
  ]);

  /**
   *
   *
   * @public
   * @type {IOptions}
   * @memberof Main
   */
  public options: IOptions = null;

  /**
   *
   *
   * @private
   * @type {IWindows}
   * @memberof Main
   */
  private windows: IWindows = {
    main: null,
    playcheck: null,
    games: new Map(),
    updater: null
  };

  /**
   *
   *
   * @private
   * @type {IState}
   * @memberof Main
   */
  private state: IState = {
    isServe: process.argv.slice(1).some(val => val === '--serve'),
    isReady: false,
    isLogin: false,
    isAskingExit: false,
    networkStatus: false,
    sound: {
      bgm: true,
      se: true,
      volume: 50
    },
    credentials: {
      playerCode: null,
      password: null,
      token: null
    }
  };

  /**
   *
   *
   * @private
   * @type {Tray}
   * @memberof Main
   */
  private tray: Tray = null;

  /**
   *
   *
   * @private
   * @type {IAutoUpdater}
   * @memberof Main
   */
  private autoUpdater: IAutoUpdater = null;

  /**
   *
   *
   * @private
   * @type {IAutoUpdater}
   * @memberof Main
   */
  private store: Store = new Store();

  /**
   *Creates an instance of Main.
   * @memberof Main
   */
  constructor() {
    this.initEnv();
    this.initApp();
  }

  /**
   *
   *
   * @private
   * @type {TEnv}
   * @memberof Main
   */
  private _env: TEnv = null;

  /**
   *
   * @private
   * @description 環境変数を推測して適切に補完しながら設定する。buildされたアプリから `process.env.NODE_ENV` は取得できないので様々な方法から判定する。
   * @type {void}
   * @memberof Main
   */
  private initEnv(): void {
    let env: TEnv = null;
    const isServe: boolean = this.isServe;
    const isProd: boolean = this.isPackaged && !RunAsDev && !isServe;

    try {
      const processEnv: TEnv = process.env.NODE_ENV as TEnv;
      const dotEnv: TEnv = _.get(
        Dotenv.config({ path: Path.join(__dirname, '.env') }),
        'parsed.NODE_ENV'
      ) as TEnv;
      if (isServe) {
        env = processEnv || 'development';
      }

      if (isProd) {
        env = processEnv || dotEnv || 'production';
      }
    } catch (error) {
      Log.error(error);
    } finally {
      if (_.isEmpty(env)) {
        env = isProd ? 'production' : 'development';
      }
    }

    this.env = env;
  }

  /**
   *
   * @private
   * @readonly
   * @description 環境変数を取得する。
   * @type {TEnv}
   * @memberof Main
   */
  private get env(): TEnv {
    return this._env;
  }

  /**
   *
   *
   * @private
   * @param {TEnv} env
   * @memberof Main
   */
  private set env(env: TEnv) {
    if (!_.isEmpty(env)) {
      process.env.NODE_ENV = env;
      this._env = env;
      this.setOptions();
    }
  }

  /**
   *
   * @private
   * @type {void}
   * @memberof Main
   */
  private setOptions(): void {
    try {
      this.options = _.merge({}, _.cloneDeep(BaseConfig));
      const isServe: boolean = this.isServe;
      const isProd: boolean = this.isPackaged && !RunAsDev && !isServe;
      if (isProd) {
        const dir: string = process.env.NODE_CONFIG_DIR;
        const path: string = Path.join(dir, `${this.env}.json`);
        if (Fs.existsSync(path)) {
          const json = Fs.readFileSync(path);
          this.options = _.extend(
            _.cloneDeep(BaseConfig),
            JSON.parse(`${json}`)
          );
        }
      }

      if (!this.isProd) {
        Log.debug(`
        ##### DEBUG INFO #####
        PROCESS_ENV=${process.env.NODE_ENV}
        ENV=${this.env}
        CONFIG_ENV=${BaseConfig.util.getEnv('NODE_ENV')}
        IS_PACKAGED=${this.isPackaged}
        RUN_AS_DEV=${RunAsDev}
        ARGV=${JSON.stringify(process.argv)}
        ENV_VARIABLES=${JSON.stringify(_.get(process, 'env'))}
        OPTIONS=${JSON.stringify(this.options)}
        ##### DEBUG INFO #####`);
      }
    } catch (error) {
      Log.error(error);
    }
  }

  /**
   *
   * @private
   * @readonly
   * @description パッケージされているかどうか
   * @type {boolean}
   * @memberof Main
   */
  private get isPackaged(): boolean {
    return App.isPackaged;
  }

  /**
   *
   * @private
   * @readonly
   * @description `--serve` 引数で起動しているかどうか？
   * @type {boolean}
   * @memberof Main
   */
  private get isServe(): boolean {
    return this.state.isServe;
  }

  /**
   *
   * @private
   * @readonly
   * @description プロダクションモードかどうか判定する。
   * @type {boolean}
   * @memberof Main
   */
  private get isProd(): boolean {
    return this.env === 'production';
  }

  /**
   *
   * @private
   * @readonly
   * @description アプリケーションのiconを`NativeImage`として取得する。
   * @type {NativeImage}
   * @memberof Main
   */
  private get icon(): NativeImage {
    try {
      return NativeImage.createFromDataURL(this.options.common.icon);
    } catch (error) {
      this.handleError(error);
      return NativeImage.createEmpty();
    }
  }

  /**
   *
   * @private
   * @readonly
   * @deprecated
   * @description `userAgent`を取得する。
   * @type {string}
   * @memberof Main
   */
  private get userAgent(): string {
    return (
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36' ||
      this.currentUserSession.getUserAgent()
    );
  }

  /**
   *
   * @private
   * @readonly
   * @description app固有の`Session`
   * @type {Session}
   * @memberof Main
   */
  private get currentUserSession(): Session {
    return Session.fromPartition(`persist:${App.getName()}`);
  }

  /**
   *
   * @private
   * @readonly
   * @description defaultの`Session`
   * @type {Session}
   * @memberof Main
   */
  private get defaultSession(): Session {
    return Session.defaultSession;
  }

  /**
   *
   * @private
   * @readonly
   * @description main window用の`BrowserWindowConstructorOptions`
   * @type {BrowserWindowConstructorOptions}
   * @memberof Main
   */
  private get mainWindowOptions(): BrowserWindowConstructorOptions {
    return {
      icon: this.icon,
      backgroundColor: '#191c22',
      x: 0,
      y: 0,
      width: 972,
      height: 728,
      kiosk: false,
      useContentSize: true,
      frame: true,
      show: true,
      transparent: false,
      resizable: false,
      minimizable: true,
      maximizable: false,
      movable: true,
      fullscreenable: false,
      closable: true,
      skipTaskbar: false,
      alwaysOnTop: false,
      webPreferences: this.defaultWebPreferences
    };
  }

  /**
   *
   * @private
   * @readonly
   * @description game window用の`BrowserWindowConstructorOptions`
   * @type {BrowserWindowConstructorOptions}
   * @memberof Main
   */
  private get gameWindowOptions(): BrowserWindowConstructorOptions {
    const icon: NativeImage = this.icon;
    const bounds: Rectangle = this.focusedWindow.getBounds();
    const adjustment: number = 32 * (this.windows.games.size + 1);
    const x: number = bounds.x + adjustment;
    const y: number = bounds.y + adjustment;

    return {
      x,
      y,
      icon,
      backgroundColor: '#191c22',
      width: 972,
      height: 728,
      kiosk: false,
      useContentSize: true,
      frame: true,
      show: true,
      alwaysOnTop: false,
      transparent: false,
      resizable: false,
      minimizable: true,
      maximizable: false,
      fullscreenable: false,
      closable: true,
      modal: false,
      parent: null,
      webPreferences: this.gameWebPreferences
    };
  }

  /**
   *
   *
   * @readonly
   * @private
   * @description playcheck window用の`BrowserWindowConstructorOptions`
   * @type {BrowserWindowConstructorOptions}
   * @memberof Main
   */
  private get playcheckWindowOptions(): BrowserWindowConstructorOptions {
    const title: string = this.getLang('HISTORY');
    const icon: NativeImage = this.icon;
    const bounds: Rectangle = this.focusedWindow.getBounds();
    const adjustment: number = 32;
    const x: number = bounds.x + adjustment;
    const y: number = bounds.y + adjustment;

    return {
      x,
      y,
      icon,
      title,
      backgroundColor: '#191c22',
      width: 800,
      height: 600,
      kiosk: false,
      useContentSize: true,
      frame: true,
      show: true,
      alwaysOnTop: true,
      transparent: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      closable: true,
      modal: false,
      parent: null,
      webPreferences: this.gameWebPreferences
    };
  }

  /**
   *
   *
   * @readonly
   * @private
   * @description updater window用の`BrowserWindowConstructorOptions`
   * @type {BrowserWindowConstructorOptions}
   * @memberof Main
   */
  private get updaterWindowoptions(): BrowserWindowConstructorOptions {
    const title: string = this.getLang('UPDATE');
    const icon: NativeImage = this.icon;
    const width: number = 480;
    const height: number = 480;
    const x: number = 0;
    const y: number = 0;
    const skipTaskbar: boolean = true;
    const center: boolean = true;
    const frame: boolean = true;
    const resizable: boolean = false;
    const movable: boolean = true;
    const minimizable: boolean = false;
    const maximizable: boolean = false;
    const closable: boolean = true;
    const alwaysOnTop: boolean = true;
    const backgroundColor: string = '#191c22';
    const opacity: number = 0.9;
    const transparent: boolean = false;
    const modal: boolean = false;
    const kiosk: boolean = false;
    const useContentSize: boolean = false;
    const show: boolean = true;
    const fullscreenable: boolean = false;
    const parent: BrowserWindow = null;
    const options: BrowserWindowConstructorOptions = {
      title,
      icon,
      skipTaskbar,
      center,
      backgroundColor,
      opacity,
      transparent,
      width,
      height,
      x,
      y,
      show,
      frame,
      closable,
      alwaysOnTop,
      resizable,
      movable,
      minimizable,
      maximizable,
      kiosk,
      modal,
      fullscreenable,
      useContentSize,
      parent,
      webPreferences: this.defaultWebPreferences
    };

    return options;
  }

  /**
   *
   * @private
   * @readonly
   * @description デフォルトの`BrowserWindowConstructorOptions`
   * @type {BrowserWindowConstructorOptions}
   * @memberof Main
   */
  private get emptyWindowOptions(): BrowserWindowConstructorOptions {
    return {
      backgroundColor: '#000',
      x: 0,
      y: 0,
      opacity: 0,
      width: 1,
      height: 1,
      kiosk: false,
      useContentSize: true,
      frame: false,
      show: false,
      alwaysOnTop: false,
      transparent: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      closable: true,
      modal: false,
      parent: null,
      webPreferences: this.gameWebPreferences
    };
  }

  /**
   *
   * @private
   * @readonly
   * @description デフォルトの`WebPreferences`
   * @memberof Main
   */
  private get defaultWebPreferences(): WebPreferences {
    return {
      webviewTag: true,
      session: this.currentUserSession,
      nativeWindowOpen: true,
      affinity: undefined,
      plugins: true,
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      autoplayPolicy: 'no-user-gesture-required',
      defaultFontFamily: this.defaultFontFamily
    };
  }

  /**
   *
   * @private
   * @readonly
   * @description game用の`WebPreferences`
   * @memberof Main
   */
  private get gameWebPreferences(): WebPreferences {
    return {
      preload: Path.join(__dirname, 'preload.js'),
      webviewTag: false,
      session: this.currentUserSession,
      nativeWindowOpen: true,
      affinity: undefined,
      plugins: true,
      nodeIntegration: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      autoplayPolicy: 'no-user-gesture-required',
      defaultFontFamily: this.defaultFontFamily
    };
  }

  /**
   *
   * @private
   * @readonly
   * @description デフォルトの`DefaultFontFamily`
   * @memberof Main
   */
  private get defaultFontFamily(): DefaultFontFamily {
    return {
      standard: 'Roboto',
      serif: 'Roboto',
      sansSerif: 'Roboto',
      monospace: 'Roboto'
    };
  }

  /**
   *
   * @private
   * @readonly
   * @description 現在シングルインスタンスロックを取得できるかどうか判定。
   * @memberof Main
   */
  private get hasSingleInstanceLock(): boolean {
    try {
      return App.hasSingleInstanceLock();
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   * @deprecated
   * @private
   * @readonly
   * @memberof Main
   */
  private get isBuiltinAutoUpdater(): boolean {
    return this.options.update.provider === 'electron';
  }

  /**
   *
   * @private
   * @readonly
   * @description ゲームWINDOWは最大`${this.options.common.maxGameWindows}`までしか開けない。
   * @memberof Main
   */
  private get tooManyWindows(): boolean {
    return this.windows.games.size === this.options.common.maxGameWindows;
  }

  /**
   *
   * @private
   * @readonly
   * @description 現在フォーカス中のウインドウを取得する。
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private get focusedWindow(): BrowserWindow {
    return BrowserWindow.getFocusedWindow() ||
      this.isValidWindow(this.windows.main)
      ? this.windows.main
      : null;
  }

  /**
   *
   *
   * @readonly
   * @private
   * @description アプリのタイトルを取得する。
   * @type {string}
   * @memberof Main
   */
  private get title(): string {
    const title: string = `CASINO ${this.options.version}`;
    const env: TEnv = this.env;
    switch (env) {
      case 'production':
        return `${title}`;
      default:
        return `${title} [${_.toUpper(env)}]`;
    }
  }

  /**
   *
   *
   * @readonly
   * @private
   * @description アプリを複数起動出来ないように制限するためのインスタンスロックを取得する。
   * @type {boolean}
   * @memberof Main
   */
  private get singleInstanceLock(): boolean {
    try {
      return App.requestSingleInstanceLock();
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   * @private
   * @description initialize `AutoUpdater`.
   * @memberof Main
   */
  private initAutoUpdater(): void {
    try {
      if (this.options.update.autoUpdate === true) {
        this.autoUpdater = <IAutoUpdater>autoUpdater;
        this.autoUpdater.logger = Log;
        this.autoUpdater.allowDowngrade = false;
        this.autoUpdater.autoDownload = this.options.update.autoDownload;
        this.autoUpdater.autoInstallOnAppQuit = this.options.update.autoDownload;
        if (this.isServe) {
          this.autoUpdater.updateConfigPath = Path.join(
            __dirname,
            'dev-app-update.yml'
          );
        }

        this.autoUpdater
          .on('before-quit-for-update', this.onBeforeQuitForUpdate.bind(this))
          .on('update-downloaded', this.onUpdateDownloaded.bind(this))
          .on('update-available', this.onUpdateAvailable.bind(this))
          .on('update-not-available', this.onUpdateNotAvailable.bind(this))
          .on('checking-for-update', this.onCheckingForUpdate.bind(this))
          .on('error', this.onUpdateError.bind(this));

        if (this.options.update.autoDownload) {
          this.checkForUpdatesAndNotify();
        } else {
          this.checkForUpdates();
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @deprecated
   * @private
   * @description initialize `Menu`.
   * @memberof Main
   */
  private initMenu(): void {
    try {
      const label: string = this.getLang('EXIT');
      const tooltip: string = this.getLang('MENU');
      const click: () => void = this.doGracefulShutdown.bind(this);
      const accelerator: Accelerator = this.accelerators.get('QUIT');
      const icon: NativeImage = this.icon;
      const cmd: MenuItemConstructorOptions = {
        icon,
        label,
        accelerator,
        click
      };
      const contextMenu: Menu = Menu.buildFromTemplate([cmd]);
      this.tray = new Tray(this.icon);
      this.tray.setContextMenu(contextMenu);
      this.tray.setToolTip(tooltip);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize main `BrowserWindow`.
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private initMainWindow(): BrowserWindow {
    try {
      if (this.isValidWindow(this.windows.main)) {
        return this.windows.main;
      }

      const options: BrowserWindowConstructorOptions = _.cloneDeep(
        this.mainWindowOptions
      );
      const window: BrowserWindow = new BrowserWindow(options);

      window
        .once('show', this.onMainWindowShow.bind(this))
        .on('close', this.onMainWindowClose.bind(this))
        .once('closed', this.onMainWindowClosed.bind(this))
        .on('blur', this.onMainWindowBlur.bind(this))
        .on('focus', this.onMainWindowFocus.bind(this));
      window.loadURL(this.getLoadUrl(this.options.file.index)).catch(NOOP);
      window.show();
      window.center();
      window.setTitle(this.title);

      return window;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   * @private
   * @description initialize `App`.
   * @memberof Main
   */
  private initApp(): void {
    try {
      this.initProcessHandler();
      this.initCrashReporter();
      this.initProtocol();
      this.initLog();
      this.initSentry();
      this.initIpcMain();
      this.initAppComandLine();
      this.initAppEventHandler();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `App` commandLine.
   * @memberof Main
   */
  private initAppComandLine(): void {
    try {
      App.disableHardwareAcceleration();
      App.disableDomainBlockingFor3DAPIs();
      App.commandLine.appendSwitch('js-flags', '--expose-gc');
      App.commandLine.appendSwitch(
        'autoplay-policy',
        'no-user-gesture-required'
      );
      if (this.options.network.proxy) {
        App.commandLine.appendSwitch(
          'proxy-server',
          this.options.network.proxy
        );
        App.commandLine.appendSwitch(
          'proxy-bypass-list',
          '<local>;*.google.com;'
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `App` to attach event handler.
   * @memberof Main
   */
  private initAppEventHandler(): void {
    try {
      App.once('window-all-closed', this.onWindowAllClosed.bind(this))
        .once('ready', this.onReady.bind(this))
        .on('web-contents-created', this.onWebContentsCreated.bind(this))
        .on('browser-window-created', this.onBrowserWindowCreated.bind(this))
        .on('activate', this.onActivate.bind(this))
        .on('will-quit', this.onWillQuit.bind(this))
        .on('second-instance', this.onSecondInstance.bind(this));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `IpcMain`.
   * @memberof Main
   */
  private initIpcMain(): void {
    try {
      IpcMain.on('ipc-request-logout', this.onRequestLogout.bind(this))
        .on('ipc-request-window-state', this.onRequestWindowState.bind(this))
        .on('ipc-request-check-game', this.onCheckGame.bind(this))
        .on('ipc-request-open-game', this.onRequestOpenGame.bind(this))
        .on('ipc-request-show-dialog', this.onRequestShowDialog.bind(this))
        .on('ipc-request-change-volume', this.onRequestChangeVolume.bind(this))
        .on('ipc-request-fullscreen', this.onRequestFullscreen.bind(this))
        .on('ipc-request-set-env', this.onRequestSetEnv.bind(this))
        .on(
          'ipc-request-network-status',
          this.onRequestNetworkStatus.bind(this)
        );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `GlobalShortcut`. this method needs to be called in `app.on('ready')`
   * @memberof Main
   */
  private initGlobalShortcut(): void {
    try {
      if (this.options.shortcut.useGlobal) {
        const map: (...args) => any = ([k, v]: [
          IAcceleratorAlias,
          Accelerator
        ]) => {
          switch (k) {
            case 'QUIT':
              if (!GlobalShortcut.isRegistered(v)) {
                GlobalShortcut.register(v, this.doGracefulShutdown.bind(this));
              }
              break;

            case 'FLUSH':
              if (!GlobalShortcut.isRegistered(v)) {
                GlobalShortcut.register(
                  v,
                  this.flushBrowserWindowCache.bind(this)
                );
              }
              break;

            case 'DEBUG':
              if (!GlobalShortcut.isRegistered(v)) {
                GlobalShortcut.register(v, this.openDevTools.bind(this));
              }
              break;

            default:
              if (!GlobalShortcut.isRegistered(v)) {
                GlobalShortcut.register(v, NOOP);
              }
              break;
          }
        };
        _.toArray(this.accelerators.entries()).map(map);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @description initialize `WebContents`.
   * @param {ILoadEvent} event
   * @param {WebContents} contents
   * @memberof Main
   */
  private initWebContents(event: ILoadEvent, contents: WebContents): void {
    try {
      if (!this.isProd) {
        Log.debug('initWebContents', event, event.sender, contents);
      }

      if (this.isValidWebContents(contents)) {
        this.getUserConfig();
        contents
          .on('media-started-playing', this.onMediaStartedPlaying.bind(this))
          .on('crashed', this.onCrashed.bind(this))
          .on('unresponsive', this.onUnresponsive.bind(this))
          .on('destroyed', this.onDestroyed.bind(this))
          .on('did-navigate', this.onDidNavigate.bind(this))
          .on('did-navigate-in-page', this.onDidNavigateInPage.bind(this))
          .on('did-start-loading', this.onDidStartOrFinishLoad.bind(this))
          .on('did-finish-load', this.onDidStartOrFinishLoad.bind(this))
          .on('did-start-navigation', this.onDidStartNavigation.bind(this))
          .on('new-window', this.onNewWindow.bind(this))
          .on('will-attach-webview', this.onWillAttachWebview.bind(this))
          .on('will-navigate', this.onWillNavigate.bind(this))
          .on('did-fail-load', this.onFailNavigate.bind(this));

        contents.session.on('will-download', this.onWillDownload.bind(this));
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description initialize `CrashReporter`.
   * @memberof Main
   */
  private initCrashReporter(): void {
    try {
      CrashReporter.start({
        companyName: App.getName(),
        productName: App.getName(),
        ignoreSystemCrashHandler: true,
        submitURL: this.options.sentry.api
      });
    } catch (error) {
      Log.error(error);
    }
  }

  /**
   *
   *
   * @private
   * @description initialize `NodeJS.Process`.
   * @returns {NodeJS.Process}
   * @memberof Main
   */
  private initProcessHandler(): NodeJS.Process {
    try {
      return process
        .on('warning', this.handleError.bind(this))
        .on('unhandledRejection', this.handleError.bind(this))
        .on('uncaughtException', this.handleError.bind(this));
    } catch (error) {
      Log.error(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `Protocol`.
   * @memberof Main
   */
  private initProtocol(): void {
    try {
      return Protocol.registerSchemesAsPrivileged([
        {
          scheme: 'file',
          privileges: {
            standard: true,
            supportFetchAPI: true,
            secure: true,
            corsEnabled: true
          }
        }
      ]);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `Log`.
   * @memberof Main
   */
  private initLog(): void {
    try {
      Log.transports.file.level = 'verbose';
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description initialize `Sentry` debugging.
   * @memberof Main
   */
  private initSentry(): void {
    try {
      const { dsn }: ISentryOptions = this.options.sentry;
      Sentry.init({ dsn });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description set `LocalShortcut` and give focus.
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private initWindow(window: BrowserWindow): void {
    try {
      if (this.isValidWindow(window)) {
        this.setLocalShortcut(window);
        this.disableWindowMenu(window);
        this.restoreAndFocusWindow(window);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when `WebContents` will be start to download. avoid to show download dialog.
   * @param {Event} event
   * @param {DownloadItem} item
   * @param {WebContents} contents
   * @memberof Main
   */
  private onWillDownload(
    event: Event,
    item: DownloadItem,
    contents: WebContents
  ): void {
    try {
      event.preventDefault();
      if (!this.isProd) {
        Log.debug('onWillDownload', event, item, contents);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when updater will be quit to update.
   * @returns {void}
   * @memberof Main
   */
  private onBeforeQuitForUpdate(): void {
    try {
      Log.warn('ON BEFORE QUIT FOR UPDATE');
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when updater has been complete to download.
   * @memberof Main
   */
  private onUpdateDownloaded(): void {
    try {
      Log.info('ON UPDATE DOWNLOADED');
      this.ensureSafeQuit();
      setTimeout(this.autoUpdater.quitAndInstall.bind(this.autoUpdater), 6000);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when updater detect a new update.
   * @param {Error} err
   * @memberof Main
   */
  private onUpdateError(err: Error): void {
    try {
      this.handleError(err);
      if (!this.isCodeSignatureError(err)) {
        const message: string = this.getLang('ERROR_ON_UPDATE');
        const options: MessageBoxSyncOptions = {
          message,
          buttons: [this.getLang('OK')]
        };
        const window: BrowserWindow = this.windows.main;
        this.showDialog(window, options);
      }

      this.tryToCloseWindow(this.windows.updater);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @description event handler when updater detect a new update.
   * @param {IUpdateAvailableEvent} event
   * @memberof Main
   */
  private onUpdateAvailable(event: IUpdateAvailableEvent): void {
    try {
      const {
        version,
        files = [],
        path,
        sha512,
        releaseDate
      }: IUpdateAvailableEvent = event;
      Log.info(
        `[DETECT UPDATE]
        VERSION ${version} > ${this.options.version}
        PATH ${path}
        SHA512 ${sha512}
        DATE: ${releaseDate}`,
        files
      );

      const type: string = 'question';
      const title: string = this.getLang('NEW_UPDATE');
      const message: string = this.getLang('INSTALL_WITH_RESTART');
      const defaultId: number = 0;
      const buttons: string[] = [this.getLang('OK')];
      const options: MessageBoxSyncOptions = {
        type,
        defaultId,
        buttons,
        title,
        message
      };
      const window: BrowserWindow = this.windows.updater;
      this.showDialog(window, options);
      return this.doDownload();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when updater detect no updates.
   * @memberof Main
   */
  private onUpdateNotAvailable(): void {
    try {
      Log.info('NO UPDATE!');
      this.tryToCloseWindow(this.windows.updater);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when updater has been called `CheckForUpdate`
   * @memberof Main
   */
  private onCheckingForUpdate(): void {
    try {
      Log.info('ON CHECKING FOR UPDATE');
      this.openUpdaterWindow();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when updater window has been shown.
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onUpdaterWindowShow(event: IBrowserWindowEvent): void {
    try {
      if (!this.isProd) {
        Log.info('onUpdaterWindowShow');
      }

      const window: BrowserWindow = event.sender;
      this.initWindow(window);

      this.windows.updater = window;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when updater window will be closed.
   * @memberof Main
   */
  private onUpdaterWindowClose(event: IBrowserWindowEvent): void {
    try {
      if (!this.isProd) {
        Log.info('onUpdaterWindowClose');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when updater window has been closed.
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onUpdaterWindowClosed(event: IBrowserWindowEvent): void {
    try {
      if (!this.isProd) {
        Log.info('onUpdaterWindowClosed');
      }

      this.unsetLocalShortcut(event.sender);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.windows.updater = null;
    }
  }

  /**
   *
   * @private
   * @description event handler when user has been logged in.
   * @memberof Main
   */
  private onLogin(): void {
    this.state.isLogin = true;
  }

  /**
   *
   * @private
   * @description event handler when user has been logged out.
   * @memberof Main
   */
  private onLogout(): void {
    try {
      this.closeAllModalWindows();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.state.isLogin = false;
      this.state.credentials.playerCode = null;
      this.state.credentials.password = null;
      this.state.credentials.token = null;
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `Logout` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {*} arg
   * @memberof Main
   */
  private onRequestLogout(event: IpcMainEvent, arg: any): void {
    try {
      this.onLogout();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `ChangeVolume` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {IStateSound} arg
   * @memberof Main
   */
  private onRequestChangeVolume(event: IpcMainEvent, arg: IStateSound): void {
    try {
      if (!this.isProd) {
        Log.info('onRequestChangeVolume', event, arg);
      }

      this.setSoundState(arg);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description `Renderer` requests `WindowState` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {*} arg
   * @memberof Main
   */
  private onRequestWindowState(event: IpcMainEvent, arg: any): void {
    try {
      const window: BrowserWindow = this.windows.main;
      if (this.isValidWindow(window)) {
        const isActive: boolean = window.isFocused();
        this.sendToWebContents(
          window,
          'ipc-reply-change-window-state',
          isActive
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `CheckGame` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {IGamePayload} arg
   * @memberof Main
   */
  private onCheckGame(event: IpcMainEvent, arg: IGamePayload): void {
    try {
      if (!this.isProd) {
        Log.info('onCheckGame', event, arg);
      }

      const { gameCode }: IGamePayload = arg;
      const window: BrowserWindow = this.windows.main;
      this.sendToWebContents(
        window,
        'ipc-reply-check-game',
        this.isGameWindowExists(gameCode)
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `OpenGame` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {IGamePayload} arg
   * @memberof Main
   */
  private onRequestOpenGame(event: IpcMainEvent, arg: IGamePayload): void {
    try {
      if (!this.isProd) {
        Log.info('onRequestOpenGame', event, arg);
      }

      const { url }: IGamePayload = arg;
      this.setSoundState(arg);
      this.openGameWindow(url);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `ShowDialog` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {IDialogPayload} arg
   * @memberof Main
   */
  private onRequestShowDialog(event: IpcMainEvent, arg: IDialogPayload): void {
    try {
      if (!this.isProd) {
        Log.info('onRequestShowDialog', event, arg);
      }

      const { message }: IDialogPayload = arg;
      const buttons = [this.getLang('OK')];
      const options: MessageBoxSyncOptions = {
        message,
        buttons
      };
      const window: BrowserWindow = this.windows.main;
      const result: number = this.showDialog(window, options);

      return this.sendToWebContents(window, 'ipc-reply-show-dialog', result);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `fullscreen` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {*} arg
   * @memberof Main
   */
  private onRequestFullscreen(event: IpcMainEvent, arg: any): void {
    try {
      const window: BrowserWindow = this.windows.main;
      if (this.isValidWindow(window)) {
        const flg: boolean = !window.isFullScreen();
        window.setFullScreenable(true);
        window.setSimpleFullScreen(flg);
        window.setFullScreen(flg);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Renderer` requests `NetworkStatus` to `Main` process.
   * @param {IpcMainEvent} event
   * @param {INetworkStatusPayload} arg
   * @memberof Main
   */
  private onRequestNetworkStatus(
    event: IpcMainEvent,
    arg: INetworkStatusPayload
  ): void {
    try {
      const { status = false } = arg;
      this.state.networkStatus = status;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @param {IpcMainEvent} event
   * @param {ISetEnvPayload} arg
   * @memberof Main
   */
  private onRequestSetEnv(event: IpcMainEvent, arg: ISetEnvPayload): void {
    try {
      if (!this.isProd) {
        const { env = null } = arg;
        this.env = env;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when new `Webview` will be attached.
   * @param {Event} event
   * @param {WebPreferences} webPreferences
   * @param {any} params
   * @memberof Main
   */
  private onWillAttachWebview(
    event: Event,
    webPreferences: WebPreferences,
    params: any
  ): void {
    try {
      Log.info(event, webPreferences, params);
      webPreferences.nativeWindowOpen = true;
      webPreferences.affinity = undefined;
      webPreferences.webviewTag = true;
      webPreferences.session = this.currentUserSession;
      webPreferences.plugins = true;
      webPreferences.nodeIntegration = true;
      webPreferences.allowRunningInsecureContent = true;
      webPreferences.webSecurity = false;
      webPreferences.defaultFontFamily = this.defaultFontFamily;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when new `BrowserWindow` will be created.
   * @param {INewBrowserWindowEvent} event
   * @param {string} url
   * @param {string} title
   * @param {'default'|'foreground-tab'|'background-tab'|'new-window'|'save-to-disk'|'other'} disposition
   * @param {*} options
   * @param {string[]} additionalFeatures
   * @param {Referrer} referrer
   * @returns {void}
   * @memberof Main
   */
  private onNewWindow(
    event: INewBrowserWindowEvent,
    url: string,
    title: string,
    disposition:
      | 'default'
      | 'foreground-tab'
      | 'background-tab'
      | 'new-window'
      | 'save-to-disk'
      | 'other',
    options: any,
    additionalFeatures: string[],
    referrer: Referrer
  ): void {
    try {
      if (!this.isProd) {
        Log.debug(
          `onNewWindow: URL ====> ${url}`,
          event,
          title,
          disposition,
          options,
          referrer
        );
      }

      switch (true) {
        case this.isEmptyPlaycheckUrl(url):
        case this.isBlankUrl(url):
          this.preventNewWindowEvent(event);
          break;

        case this.isGameUrl(url):
        case this.isLiveGameUrl(url):
          this.preventNewWindowEvent(event);
          this.openGameWindow(url);
          break;

        default:
          if (!this.isProd) {
            throw new Error(`Performed unknown url: ${url}`);
          }
          break;
      }
    } catch (error) {
      this.handleError(error);
      this.openExternalUrl(url);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when playcheck window has been shown.
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onPlaycheckWindowShow(event: IBrowserWindowEvent): void {
    try {
      const window: BrowserWindow = event.sender;
      this.initWindow(window);

      this.windows.playcheck = window;
      Log.info('onPlaycheckWindowShow');
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when playcheck window will be closed.
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onPlaycheckWindowClose(event: IBrowserWindowEvent): void {
    try {
      Log.info('onPlaycheckWindowClose');
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when playcheck window has been closed.
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onPlaycheckWindowClosed(event: IBrowserWindowEvent): void {
    try {
      if (!this.isProd) {
        Log.info('onPlaycheckWindowClosed');
      }

      this.unsetLocalShortcut(event.sender);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.windows.playcheck = null;
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when game window has been shown.
   * @param {IBrowserWindowEvent} event
   * @param {BrowserWindow} [window=null]
   * @param {string} [title=null]
   * @memberof Main
   */
  private onGameWindowShow(
    event: IBrowserWindowEvent,
    window: BrowserWindow = null,
    title: string = null
  ): void {
    try {
      if (!this.isProd) {
        Log.debug('onGameWindowShow', event);
      }

      window = window || <BrowserWindow>event.sender;
      this.initWindow(window);

      if (this.isValidWindow(window)) {
        const contents: WebContents = window.webContents;
        if (this.isValidWebContents(contents)) {
          this.setStyleOnWebContents(contents);
          this.setGameWindow(
            title || this.getGameCodeByUrl(this.getContentsUrl(contents)),
            window
          );
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when game window will be closed.
   * @param {IBrowserWindowEvent} event
   * @param {BrowserWindow} [window=null]
   * @param {string} [title=null]
   * @memberof Main
   */
  private onGameWindowClose(
    event: IBrowserWindowEvent,
    window: BrowserWindow = null,
    title: string = null
  ): void {
    try {
      if (!this.isProd) {
        Log.debug('onGameWindowClose', event);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when game window has been closed.
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onGameWindowClosed(
    event: IBrowserWindowEvent,
    window: BrowserWindow = null,
    title: string = null
  ): void {
    try {
      if (!this.isProd) {
        Log.debug('onGameWindowClosed', event);
      }

      this.unsetLocalShortcut(window);
      this.deleteGameWindow(title);
      const filter: (...args) => boolean = ([key, win]: [
        string,
        BrowserWindow
      ]) => this.isWindow(win) && !this.isValidWindow(win);
      const map: (...args) => any = ([key, win]: [string, BrowserWindow]) =>
        this.deleteGameWindow(key);
      _.toArray(this.windows.games.entries())
        .filter(filter)
        .map(map);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler on `WebContents` when location has been started/changed.
   * @param {ILoadEvent} event
   * @memberof Main
   */
  private onDidStartOrFinishLoad(event: ILoadEvent): void {
    try {
      if (!this.isProd) {
        Log.info(`DID-START-OR-FINISH-LOADING`, event);
      }

      const contents: WebContents = event.sender;
      if (this.isValidWebContents(contents)) {
        this.setStyleOnWebContents(contents);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * description event handler on `WebContents` when location has been started to change.
   * @param {Event} event
   * @param {string} url
   * @param {boolean} isInPlace
   * @param {boolean} isMainFrame
   * @memberof Main
   */
  private onDidStartNavigation(
    event: Event,
    url: string,
    isInPlace: boolean,
    isMainFrame: boolean
  ): void {
    if (!this.isProd) {
      Log.info(
        `DID-START-NAVIGATION URL: ${url} IS IN-PLACE: ${isInPlace} IS-MAIN-FRAME: ${isMainFrame}`,
        event
      );
    }
  }

  /**
   *
   * @private
   * @description event handler on `WebContents` when location has been changed
   * @param {Event} event
   * @param {string} url
   * @param {number} httpResponseCode
   * @param {string} httpStatusText
   * @memberof Main
   */
  private onDidNavigate(
    event: Event,
    url: string,
    httpResponseCode: number,
    httpStatusText: string
  ): void {
    if (!this.isProd) {
      Log.info(
        `DID-NAVIGATE URL: ${url} HTTP STATUS: ${httpResponseCode} ${httpStatusText}`,
        event
      );
    }
  }

  /**
   *
   * @private
   * @description event handler on `WebContents` when location has been changed in case of something like `SPA` web page.
   * @param {Event} event
   * @param {string} url
   * @param {boolean} isMainFrame
   * @memberof Main
   */
  private onDidNavigateInPage(
    event: Event,
    url: string,
    isMainFrame: boolean
  ): void {
    try {
      if (isMainFrame) {
        if (this.isAbsoluteUrl(url)) {
          const { hash }: IURL = new URL(url);
          if (`${hash}`.indexOf('home') !== -1) {
            this.onLogin();
          }

          if (`${hash}`.indexOf('login') !== -1) {
            this.onLogout();
          }
        }
      }

      if (!this.isProd) {
        Log.info(
          `DID-NAVIGATE IN PAGE URL: ${url} IS-MAIN-FRAME: ${isMainFrame}`,
          event
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler on `WebContents` when media has been started to play.
   * @param {Event} event
   * @memberof Main
   */
  private onMediaStartedPlaying(event: Event): void {
    if (!this.isProd) {
      Log.debug('MEDIA-STARTED-PLAYING', event);
    }
  }

  /**
   *
   * @private
   * @description event handler when `WebContents` is destroyed.
   * @param {ILoadEvent} event
   * @memberof Main
   */
  private onDestroyed(event: ILoadEvent): void {
    try {
      if (!this.isProd) {
        Log.info(`WebContents has been destroyed...`, event);
      }

      const contents: WebContents = event.sender;
      contents.removeAllListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when `WebContents` does not respond.
   * @param {Event} event
   * @memberof Main
   */
  private onUnresponsive(event: Event): void {
    try {
      Log.error(`application does not respond...`, event);
      const window: BrowserWindow = this.windows.main;
      const result: number = this.showDialog(window, {
        buttons: [this.getLang('NO'), this.getLang('YES')],
        message: this.getLang('ERROR_APP_UNRESPOND')
      });
      if (result) {
        return this.doGracefulShutdown();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when `WebContents` is crashed.
   * @param {Event} event
   * @param {boolean} killed
   * @memberof Main
   */
  private onCrashed(event: Event, killed: boolean): void {
    try {
      Log.error(`CRASHED BY KILLED: ${killed}`, event);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when main window is open
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onMainWindowShow(event: IBrowserWindowEvent): void {
    try {
      const window: BrowserWindow = event.sender;
      this.initWindow(window);
      if (this.isValidWindow(window)) {
        this.setSessionHandler(window);
      }

      this.windows.main = window;
    } catch (error) {
      this.handleError(error);
    } finally {
      this.initGlobalShortcut();
      this.initAutoUpdater();
      // this.initMenu();
    }
  }

  /**
   *
   * @private
   * @description event handler when main window will be closed
   * @param {IBrowserWindowEvent} event
   * @returns {void}
   * @memberof Main
   */
  private onMainWindowClose(event: IBrowserWindowEvent): void {
    try {
      const window: BrowserWindow = event.sender || this.windows.main;
      const isValid: boolean = this.isValidWindow(window);
      if (isValid) {
        event.preventDefault();
        const canClose: boolean = this.confirmToExit();
        if (!canClose) {
          return this.restoreAndFocusWindow(window);
        }

        this.ensureSafeQuit();
        return this.doGracefulShutdown();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler when main window is closed
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onMainWindowClosed(event: IBrowserWindowEvent): void {
    try {
      if (!this.isProd) {
        Log.info('onMainWindowClosed');
      }

      this.unsetLocalShortcut(event.sender);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.windows.main = null;
    }
  }

  /**
   *
   * @private
   * @description event handler when main window is blur
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onMainWindowBlur(event: IBrowserWindowEvent): void {
    try {
      this.onMainWindowFocusChanged(event.sender, false);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when main window is focused
   * @param {IBrowserWindowEvent} event
   * @memberof Main
   */
  private onMainWindowFocus(event: IBrowserWindowEvent): void {
    try {
      this.onMainWindowFocusChanged(event.sender, true);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when main window is focused or not
   * @param {BrowserWindow} window
   * @param {boolean} isActive
   * @memberof Main
   */
  private onMainWindowFocusChanged(
    window: BrowserWindow,
    isActive: boolean
  ): void {
    try {
      this.sendToWebContents(window, 'ipc-reply-change-window-state', isActive);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description Event handler which is called when `App` is ready.
   * @memberof Main
   */
  private onReady(): void {
    try {
      this.state.isReady = true;
      const gotTheLock: boolean = this.singleInstanceLock;
      if (!gotTheLock) {
        return this.preventInstanceLock();
      }

      this.initMainWindow();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description Event handler which is called when `WebContents` are created on `BrowserWindow`
   * @param {ILoadEvent} event
   * @param {WebContents} contents
   * @memberof Main
   */
  private onWebContentsCreated(event: ILoadEvent, contents: WebContents): void {
    try {
      if (this.isValidWebContents(contents)) {
        const url: string = this.getContentsUrl(contents);
        if (!this.isDevToolUrl(url)) {
          if (!this.isProd) {
            Log.info(`onWebContentsCreated ${url}`, event, contents);
          }

          this.initWebContents(event, contents);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler for `fail-navigate`
   * @param {Event} event
   * @param {string} url
   * @memberof Main
   */
  private onFailNavigate(
    event: Event,
    errorCode: number,
    errorDescription: string,
    validatedURL: string,
    isMainFrame: boolean,
    frameProcessId: number,
    frameRoutingId: number
  ): void {
    try {
      if (!this.isProd) {
        Log.warn(
          event,
          `FAIL NAVIGATE
           ERROR CODE: ${errorCode}
           ERROR DESC: ${errorDescription}
           URL: ${validatedURL}
           IS MAIN FRAME: ${isMainFrame}
           FRAME PROCESS ID: ${frameProcessId}
           FRAME ROUTING ID: ${frameRoutingId}`
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler for `will-navigate`. Playcheckのウインドウは`about:blank`で開く為，その時点ではURLが拾えない。そのため，LOADイベントで捉える。
   * @param {Event} event
   * @param {string} url
   * @memberof Main
   */
  private onWillNavigate(event: ILoadEvent, url: string): void {
    try {
      if (!this.isProd) {
        Log.info(`WILL NAVIGATE URL: ${url} `, event);
      }

      if (this.isPlaycheckUrl(url)) {
        this.openPlaycheckWindow(url);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when all `BrowserWindow` are closed.
   * @memberof Main
   */
  private onWindowAllClosed(): void {
    try {
      Log.warn('onWindowAllClosed');
      this.ensureSafeQuit();
      return this.doGracefulShutdown();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler on `App.on('activate')`
   * @memberof Main
   */
  private onActivate(): void {
    try {
      const isValid: boolean = this.isValidWindow(this.windows.main);
      if (!isValid) {
        this.initMainWindow();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler when new `BrowserWindow` is created.
   * @param {Event} event
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private onBrowserWindowCreated(event: Event, window: BrowserWindow): void {
    try {
      this.initWindow(window);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description event handler on application will quit
   * @memberof Main
   */
  private onWillQuit(): void {
    try {
      this.ensureSafeQuit();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description event handler on second instance.
   * @param {Event} event
   * @param {string[]} argv
   * @param {string} workingDirectory
   * @returns {void}
   * @memberof Main
   */
  private onSecondInstance(
    event: Event,
    argv: string[],
    workingDirectory: string
  ): void {
    try {
      Log.warn('ON 2ND INSTANCE!', event, argv, workingDirectory);
      const window: BrowserWindow = this.windows.main;
      this.restoreAndFocusWindow(window);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description validate URL is absolute or not.
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isAbsoluteUrl(url: string): boolean {
    try {
      return `${url}`.startsWith('https://') || `${url}`.startsWith('http://');
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description URLがGAMEのURLかどうか判定する。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isGameUrl(url: string): boolean {
    try {
      if (this.isAbsoluteUrl(url)) {
        if (this.isPlaycheckUrl(url) || this.isEmptyPlaycheckUrl(url)) {
          return false;
        }

        const { hostname, search, pathname }: IURL = new URL(url);
        const matches: boolean =
          `${pathname}`.indexOf('gamehistory') === -1 &&
          `${search}`.indexOf('history') !== -1;
        const found: string = _.toArray(this.options.host.game).find(
          (v: string) => `${hostname}`.includes(v)
        );

        return (
          !this.isPlaycheckUrl(url) &&
          !this.isEmptyPlaycheckUrl(url) &&
          !_.isUndefined(found) &&
          matches
        );
      }

      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description URLがLIVEのURLかどうか判定する。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isLiveGameUrl(url: string): boolean {
    try {
      if (this.isAbsoluteUrl(url)) {
        if (this.isPlaycheckUrl(url) || this.isEmptyPlaycheckUrl(url)) {
          return false;
        }

        const { hostname }: IURL = new URL(url);
        const found: string = _.toArray(this.options.host.live).find(
          (v: string) => `${hostname}`.includes(v)
        );

        return !_.isUndefined(found);
      }

      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description 開いたURLがネットワークエラーなどが発生し，表示できない場合，`chrome-error://chromewebdata`にリダイレクトするのでその判定処理。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isWebErrorUrl(url: string): boolean {
    try {
      return `${url}`.includes('chrome-error://chromewebdata');
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description URLが `devtools://`かどうか判定する。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isDevToolUrl(url: string): boolean {
    try {
      return `${url}`.includes('devtools://');
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description URLが `about:blank`かどうか判定する。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isBlankUrl(url: string): boolean {
    try {
      return url === 'about:blank';
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description playcheck URLかどうか判定する。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isPlaycheckUrl(url: string): boolean {
    try {
      if (this.isAbsoluteUrl(url)) {
        const { host, pathname }: IURL = new URL(url);
        const matches: boolean = `${pathname}`.indexOf('gamehistory') !== -1;
        const found: string = _.concat(
          this.options.host.game,
          this.options.host.live
        ).find((v: string) => `${host}`.includes(v));

        return !_.isUndefined(found) && matches;
      }

      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   * @private
   * @description playcheckを開くとき，最初に経由するURL。多分POSTで`about:blank`で開かれるので適宜処理。
   * @param {string} url
   * @returns {boolean}
   * @memberof Main
   */
  private isEmptyPlaycheckUrl(url: string): boolean {
    try {
      if (this.isAbsoluteUrl(url)) {
        const { host, search, pathname }: IURL = new URL(url);
        const matches: boolean = `${pathname}`.endsWith('null');
        const found: string = _.concat(
          this.options.host.game,
          this.options.host.live
        ).find((v: string) => `${host}`.includes(v));

        return !_.isUndefined(found) && matches;
      }

      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description check `WebContents` is valid or not.
   * @param {WebContents} contents
   * @returns {boolean}
   * @memberof Main
   */
  private isValidWebContents(contents: WebContents): boolean {
    return !_.isEmpty(contents) && !contents.isDestroyed();
  }

  /**
   *
   *
   * @private
   * @description validate whether `BrowserWindow` is valid and `BrowserWindow` instance is destroyed or not.
   * @param {BrowserWindow} window
   * @returns {boolean}
   * @memberof Main
   */
  private isValidWindow(window: BrowserWindow): boolean {
    return this.isWindow(window) && !window.isDestroyed();
  }

  /**
   *
   *
   * @private
   * @description validate whether `BrowserWindow` is valid.
   * @param {BrowserWindow} window
   * @returns {boolean}
   * @memberof Main
   */
  private isWindow(window: BrowserWindow): boolean {
    return window instanceof BrowserWindow;
  }

  /**
   *
   *
   * @private
   * @description whether error is `code signature` error or not.
   * @param {BrowserWindow} window
   * @returns {boolean}
   * @memberof Main
   */
  private isCodeSignatureError(err: Error): boolean {
    return (
      _.isError(err) &&
      `${err.message}`.includes(
        'Could not get code signature for running application'
      )
    );
  }

  /**
   *
   *
   * @private
   * @description check whether game window is already open or not.
   * @param {string} gameCode
   * @returns {boolean}
   * @memberof Main
   */
  private isGameWindowExists(gameCode: string): boolean {
    try {
      if (_.isEmpty(gameCode) || _.size(gameCode) === 0) {
        return false;
      }

      return this.windows.games.has(gameCode);
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description set `Sentry` scope when user has been logged in.
   * @memberof Main
   */
  private setSentryScope(): void {
    try {
      Sentry.configureScope(scope => {
        scope.setExtra('version', this.options.version);
        scope.setTag('platform', 'application');
        if (_.has(this.state.credentials, 'playerCode')) {
          const playerCode: string = _.get(
            this.state.credentials,
            'playerCode'
          );
          scope.setUser({
            playerCode
          });
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description set `Session` handler. if your config set `proxy` parameter, application always use `proxy` for live game host
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private setSessionHandler(window: BrowserWindow): void {
    try {
      const hosts: string[] = [].concat(
        this.options.host.game,
        this.options.host.live
      );
      const filters: OnBeforeRequestFilter = {
        urls: ['*://*/api/auth/player']
      };
      if (this.isValidWindow(window)) {
        if (_.get(this.windows.main, 'id') === _.get(window, 'id')) {
          if (this.options.network.proxy) {
            hosts.map((host: string) =>
              this.defaultSession
                .resolveProxy(`https://${host}`)
                .catch(this.handleError.bind(this))
            );
          }

          const sessions: Session[] = [
            window.webContents.session,
            this.defaultSession
          ];
          sessions.map((session: Session) =>
            session.webRequest.onBeforeRequest(
              filters,
              this.captureLoginData.bind(this)
            )
          );
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description set `CSS` on `WebContents`
   * @param {WebContents} contents
   * @memberof Main
   */
  private setStyleOnWebContents(contents: WebContents) {
    try {
      const img: string = this.options.common.logo;
      const noAnimation: string = 'animation: none important;';
      const hidden: string = `${noAnimation} display:none !important; opacity: 0 !important;`;
      const css: string = img
        ? `div.splash-logo { ${noAnimation} background: none important; background-repeat: no-repeat; background-size: cover; background-image: url('${img}') !important; } div.rotating, .splash-text { ${hidden} }`
        : `div.splash-logo, div.rotating, .splash-text { ${hidden} }`;
      const url: string = this.getContentsUrl(contents);
      if (this.isGameUrl(url) || this.isLiveGameUrl(url)) {
        contents.insertCSS(css);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description set sound state
   * @param {(IGamePayload | IStateSound)} arg
   * @memberof Main
   */
  private setSoundState(arg: IGamePayload | IStateSound) {
    try {
      const { se, bgm, volume }: IStateSound = arg;
      this.state.sound.se = se;
      this.state.sound.bgm = bgm;
      this.state.sound.volume = volume;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description set `gameCode` from `this.windows.games(Map)`
   * @param {string} gameCode
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private setGameWindow(gameCode: string, window: BrowserWindow): void {
    try {
      if (!this.isGameWindowExists(gameCode) && this.isValidWindow(window)) {
        this.windows.games.set(gameCode, window);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description get `gameCode` from `this.windows.games(Map)`
   * @param {string} gameCode
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private getGameWindow(gameCode: string): BrowserWindow {
    try {
      if (this.isGameWindowExists(gameCode)) {
        return this.windows.games.get(gameCode);
      }

      return null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   *
   * @private
   * @description delete `gameCode` from `this.windows.games(Map)`
   * @param {string} gameCode
   * @memberof Main
   */
  private deleteGameWindow(gameCode: string): void {
    try {
      if (this.isGameWindowExists(gameCode)) {
        this.windows.games.delete(gameCode);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description when subscribe `new-window` event and call `event.preventDefault()`, it must be set `event.newGuest`.
   * @param {INewBrowserWindowEvent} event
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private preventNewWindowEvent(event: INewBrowserWindowEvent): BrowserWindow {
    try {
      const window: BrowserWindow = new BrowserWindow(this.emptyWindowOptions);
      event.preventDefault();
      event.newGuest = window;
      this.tryToCloseWindow(window);
      return window;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   * @private
   * @description watch XHR request on `BrowserWindow`
   * @param {OnBeforeRequestDetails} details
   * @param {Function} [callback=(details) => {}]
   * @memberof Main
   */
  private captureLoginData(
    details: OnBeforeRequestDetails,
    callback: Function = (args: any) => Log.info(args)
  ): void {
    try {
      const resourceType: string = _.toLower(_.get(details, 'resourceType'));
      const method: string = _.toUpper(_.get(details, 'method'));
      const isXhr: boolean = resourceType === 'xhr';
      const isPost: boolean = method === 'POST';
      if (isXhr && isPost) {
        if (!this.isProd) {
          Log.info('Capture Login Data', details);
        }

        if (_.has(details, 'uploadData') && _.isArray(details.uploadData)) {
          const { uploadData }: OnBeforeRequestDetails = details;
          const [$0]: UploadData[] = uploadData;
          const { bytes }: UploadData = $0;
          const buffer: Buffer = Buffer.from(bytes);
          const {
            playerCode = null,
            password = null
          }: ICredentials = JSON.parse(`${buffer}`);
          this.state.credentials.playerCode = playerCode;
          this.state.credentials.password = password;
          this.setSentryScope();
        }
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      callback(details);
    }
  }

  /**
   *
   *
   * @private
   * @description returns current `WebContents` URL.
   * @param {WebContents} contents
   * @returns {string}
   * @memberof Main
   */
  private getContentsUrl(contents: WebContents): string {
    try {
      if (this.isValidWebContents(contents)) {
        const url: string = contents.getURL();
        return url;
      }

      return null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   *
   * @private
   * @description get `gameCode` from url.
   * @param {string} url
   * @returns {string}
   * @memberof Main
   */
  private getGameCodeByUrl(url: string): string {
    try {
      if (this.isGameUrl(url) || this.isLiveGameUrl(url)) {
        const { pathname, searchParams }: IURL = new URL(url);
        if (searchParams.has('gameCode')) {
          return this.normalizeGameCode(searchParams.get('gameCode'));
        }

        const [$gameCode]: string[] = `${pathname}`
          .split('/')
          .filter((i: string) => i.length > 0);

        return this.normalizeGameCode($gameCode);
      }

      return '';
    } catch (error) {
      this.handleError(error);
      return '';
    }
  }

  /**
   *
   * @private
   * @description get load url for file path.
   * @param {string} [filename='index.html']
   * @returns {string}
   * @memberof Main
   */
  private getLoadUrl(filename: string = 'index.html'): string {
    try {
      let url: string;
      const nonBuildApp: boolean =
        this.isServe || !!!this.isPackaged || RunAsDev;
      if (nonBuildApp) {
        const reload: any = require('electron-reload');
        const electron: any = require(`${__dirname}/node_modules/electron`);
        reload(__dirname, { electron });
        url = `${this.options.url.base}${filename}`;
      } else {
        url = URLFormatter({
          pathname: Path.join(__dirname, 'dist', filename),
          protocol: 'file:',
          slashes: true
        });
      }

      return url;
    } catch (error) {
      this.handleError(error);
      return Path.join(__dirname, 'dist', filename);
    }
  }

  /**
   *
   *
   * @private
   * @description adjustment `gameCode` string as unique.
   * @param {string} title
   * @returns {string}
   * @memberof Main
   */
  private normalizeGameCode(title: string) {
    title = `${title}`.trim().toLowerCase();
    const prefixes: string[] = ['sw_', 'qs_', 'pt_', 'ec_'];
    prefixes
      .filter((prefix: string) => title.startsWith(prefix))
      .map((prefix: string) => (title = title.replace(prefix, '')));

    return title.replace(/_|-/g, '');
  }

  /**
   *
   *
   * @private
   * @description send `Ipc` message to `WebContents`. communicate from `Main` processs to `Renderer` process.
   * @param {BrowserWindow} window
   * @param {string} channel
   * @param {...any[]} args
   * @returns {void}
   * @memberof Main
   */
  private sendToWebContents(
    window: BrowserWindow,
    channel: string,
    ...args: any[]
  ): void {
    try {
      if (this.isValidWindow(window)) {
        const contents: WebContents = window.webContents;
        if (this.isValidWebContents(contents)) {
          return contents.send(channel, args);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description disabled `BrowserWindow` menu.
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private disableWindowMenu(window: BrowserWindow): void {
    try {
      if (this.isValidWindow(window)) {
        window.setMenu(null);
        window.setMenuBarVisibility(false);
        window.removeMenu();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description restore and focus `BrowserWindow` if it is valid.
   * @param {BrowserWindow} window
   * @returns {void}
   * @memberof Main
   */
  private restoreAndFocusWindow(window: BrowserWindow): void {
    try {
      if (this.isValidWindow(window)) {
        if (window.isMinimized()) {
          window.restore();
        }

        return window.focus();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description try to close all `BrowserWindow` windows.
   * @param {boolean} [isForce=false]
   * @memberof Main
   */
  private closeAllWindows(isForce: boolean = false): void {
    try {
      BrowserWindow.getAllWindows()
        .filter(this.isValidWindow.bind(this))
        .map((window: BrowserWindow) => {
          if (isForce) {
            window.removeAllListeners();
          }

          this.tryToCloseWindow(window);
        });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.windows.main = null;
      this.windows.updater = null;
      this.windows.playcheck = null;
      this.windows.games.clear();
    }
  }

  /**
   *
   *
   * @private
   * @description try to close all game/playcheck/updater `BrowserWindow` windows.
   * @param {boolean} [isForce=false]
   * @memberof Main
   */
  private closeAllModalWindows(isForce: boolean = false): void {
    try {
      if (isForce) {
        this.tryToCloseWindow(this.windows.updater);
      }

      this.tryToCloseWindow(this.windows.playcheck);
      const filter: (...args) => boolean = ([key, window]: [
        string,
        BrowserWindow
      ]) => this.isValidWindow(window);
      const map: (...args) => any = ([key, window]: [string, BrowserWindow]) =>
        this.tryToCloseWindow(window);
      _.toArray(this.windows.games.entries())
        .filter(filter)
        .map(map);
    } catch (error) {
      this.handleError(error);
    } finally {
      if (isForce) {
        this.windows.updater = null;
      }

      this.windows.playcheck = null;
      this.windows.games.clear();
    }
  }

  /**
   *
   *
   * @private
   * @description try to close `BrowserWindow` safely.
   * @param {BrowserWindow} window
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private tryToCloseWindow(window: BrowserWindow): BrowserWindow {
    try {
      if (this.isWindow(window)) {
        if (this.isValidWindow(window)) {
          this.unsetLocalShortcut(window);
          if (!window.isClosable()) {
            window.setClosable(true);
          }

          // window.close();
          window.destroy();
        }
      }
    } catch (error) {
      this.handleError(error);
    }

    return window;
  }

  /**
   *
   *
   * @private
   * @description open updater window.
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private openUpdaterWindow(): BrowserWindow {
    try {
      if (this.isValidWindow(this.windows.updater)) {
        return this.windows.updater;
      }

      const window: BrowserWindow = new BrowserWindow(
        _.cloneDeep(this.updaterWindowoptions)
      );
      window.once('show', this.onUpdaterWindowShow.bind(this));
      window.once('close', this.onUpdaterWindowClose.bind(this));
      window.once('closed', this.onUpdaterWindowClosed.bind(this));
      window.loadURL(this.getLoadUrl(this.options.file.update)).catch(NOOP);
      window.show();
      window.center();

      return window;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   * @private
   * @description open game window
   * @param {string} url
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private openGameWindow(url: string): BrowserWindow {
    try {
      const title: string = this.getGameCodeByUrl(url);
      const existing: BrowserWindow = this.getGameWindow(title);
      if (this.isWindow(existing)) {
        if (this.isValidWindow(existing)) {
          this.restoreAndFocusWindow(existing);
          return existing;
        }

        this.deleteGameWindow(title);
      }

      if (this.tooManyWindows) {
        const parent: BrowserWindow = BrowserWindow.getFocusedWindow();
        this.showDialog(parent, {
          message: this.getLang('ERROR_LIMIT_MAX_GAME_WINDOWS')
        });

        return parent;
      }

      const options: BrowserWindowConstructorOptions = _.assign(
        _.cloneDeep(this.gameWindowOptions),
        { title }
      );
      const window: BrowserWindow = new BrowserWindow(options);
      window
        .once('show', (event: IBrowserWindowEvent) =>
          this.onGameWindowShow(event, window, title)
        )
        .once('close', (event: IBrowserWindowEvent) =>
          this.onGameWindowClose(event, window, title)
        )
        .once('closed', (event: IBrowserWindowEvent) =>
          this.onGameWindowClosed(event, window, title)
        );

      window.loadURL(url).catch(NOOP);
      window.show();
      window.focus();

      if (this.state.sound.bgm === false) {
        this.setVolumeOnWebContents(window, 0);
        this.setMuteOnWebContents(window);
      } else {
        this.setVolumeOnWebContents(window, this.state.sound.volume);
        this.setMuteOnWebContents(window, false);
      }

      return window;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   *
   * @private
   * @description open `Playcheck` window
   * @param {string} url
   * @param {BrowserWindowConstructorOptions} options
   * @returns {BrowserWindow}
   * @memberof Main
   */
  private openPlaycheckWindow(url: string): BrowserWindow {
    try {
      const isExists: boolean = this.isValidWindow(this.windows.playcheck);
      if (isExists) {
        this.tryToCloseWindow(this.windows.playcheck);
      }

      const window: BrowserWindow = new BrowserWindow(
        _.cloneDeep(this.playcheckWindowOptions)
      );
      window.once('show', this.onPlaycheckWindowShow.bind(this));
      window.once('close', this.onPlaycheckWindowClose.bind(this));
      window.once('closed', this.onPlaycheckWindowClosed.bind(this));
      window.show();
      window.loadURL(url).catch(NOOP);

      return window;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   *
   * @private
   * @description open link via default browser hosted on OS.
   * @param {string} url
   * @memberof Main
   */
  private openExternalUrl(url: string): any {
    try {
      Shell.openExternal(url);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @description run javascript on specified `WebContents`.
   * @param {BrowserWindow} window
   * @param {string} [script='alert("test")']
   * @memberof Main
   */
  private runJavascriptOnWindow(
    window: BrowserWindow,
    script: string = 'alert("test")'
  ): any {
    try {
      if (this.isValidWindow(window)) {
        const contents: WebContents = window.webContents;
        if (this.isValidWebContents(contents)) {
          return contents.executeJavaScript(script);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description open `devTool` safely
   * @param {BrowserWindow} window
   * @returns {void}
   * @memberof Main
   */
  private openDevTools(
    window: BrowserWindow = BrowserWindow.getFocusedWindow()
  ): void {
    try {
      if (this.isValidWindow(window)) {
        const contents: WebContents = window.webContents;
        if (this.isValidWebContents(contents)) {
          const url: string = this.getContentsUrl(contents);
          if (!this.isDevToolUrl(url)) {
            contents.toggleDevTools();
            setTimeout(contents.focus.bind(contents), 300);
          }
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description clear `BrowserWindow` cache
   * @param {BrowserWindow} window
   * @returns {void}
   * @memberof Main
   */
  private flushBrowserWindowCache(
    window: BrowserWindow = BrowserWindow.getFocusedWindow()
  ): void {
    try {
      if (this.isValidWindow(window)) {
        this.clearAllCache();
        const icon: NativeImage = this.icon;
        const type: string = 'info';
        const buttons: string[] = [this.getLang('OK')];
        const title: string = this.getLang('CONFIRM');
        const message: string = this.getLang('CACHE_CLEAR');
        const defaultId: number = 0;
        const options: MessageBoxSyncOptions = {
          icon,
          message,
          type,
          defaultId,
          buttons,
          title
        };
        this.showDialog(window, options);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description アプリケーション終了時の確認ダイアログを表示する。
   * @returns {boolean}
   * @memberof Main
   */
  private confirmToExit(): boolean {
    try {
      if (this.state.isAskingExit) {
        return false;
      }

      this.state.isAskingExit = true;
      const type: string = 'question';
      const buttons: string[] = [this.getLang('NO'), this.getLang('YES')];
      const title: string = this.getLang('CONFIRM');
      const message: string = this.getLang('MSG_TO_ASK_EXIT');
      const defaultId: number = 0;
      const icon: NativeImage = this.icon;
      const options: MessageBoxSyncOptions = {
        icon,
        message,
        type,
        defaultId,
        buttons,
        title
      };
      const window: BrowserWindow = this.windows.main;
      const result: number = this.showDialog(window, options);

      return result === 1;
    } catch (error) {
      this.handleError(error);
      return false;
    } finally {
      this.state.isAskingExit = false;
    }
  }

  /**
   *
   *
   * @private
   * @description アプリケーションを終了する。
   * @param {number} [delay=1000]
   * @returns {*}
   * @memberof Main
   */
  private doGracefulShutdown(delay: number = 1000): any {
    try {
      this.storeUserConfig();
      setTimeout(App.quit.bind(App), delay);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description アプリケーションを強制終了する。
   * @param {number} [delay=1000]
   * @returns {void}
   * @memberof Main
   */
  private forceExit(delay: number = 1000): void {
    try {
      this.ensureSafeQuit();
      setTimeout(App.exit.bind(App), delay);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description `autoUpdater`のバージョン確認処理を実行する。現状は`generic provider` を利用しているので不要。
   * @memberof Main
   */
  private checkForUpdatesAndNotify(): void {
    try {
      setImmediate(
        this.autoUpdater.checkForUpdatesAndNotify.bind(this.autoUpdater)
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description `autoUpdater`のバージョン確認処理を実行する。
   * @memberof Main
   */
  private checkForUpdates(): void {
    try {
      const options: IFeedURLOptions = {
        provider: 'generic',
        url: this.options.url.feed
      };
      this.autoUpdater.setFeedURL(options as any);
      setImmediate(this.autoUpdater.checkForUpdates.bind(this.autoUpdater));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description `autoUpdater`のダウンロードを実行する。
   * @memberof Main
   */
  private doDownload(): void {
    try {
      Log.info('START DOWNLOAD...');
      this.autoUpdater
        .downloadUpdate()
        .then(Log.info.bind(Log, 'COMPLETE DOWNLOAD...'))
        .catch(this.handleError.bind(this));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description アプリを確実に終了させるための処理。`BrowserWindow` eventのリスナーなどを解除してから終了処理を実行する。
   * @memberof Main
   */
  private ensureSafeQuit(): void {
    try {
      if (this.hasSingleInstanceLock) {
        this.purgeSingleInstanceLock();
      }

      this.purgeLocalShortcut();
      this.purgeGlobalShortcut();
      App.removeAllListeners();
      this.closeAllWindows(true);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @memberof Main
   */
  private purgeGlobalShortcut(): void {
    try {
      if (this.options.shortcut.useGlobal) {
        const filter: (...args) => boolean = ([k, v]: [
          IAcceleratorAlias,
          Accelerator
        ]) => GlobalShortcut.isRegistered(v);
        const map: (...args) => any = ([k, v]: [
          IAcceleratorAlias,
          Accelerator
        ]) => GlobalShortcut.unregister(v);
        _.toArray(this.accelerators.entries())
          .filter(filter)
          .map(map);
        GlobalShortcut.unregisterAll();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @memberof Main
   */
  private purgeLocalShortcut(): void {
    try {
      if (!this.options.shortcut.useGlobal) {
        BrowserWindow.getAllWindows()
          .filter(this.isValidWindow.bind(this))
          .map((window: BrowserWindow) => LocalShortcut.unregisterAll(window));
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @description アプリを複数起動出来ないように制限するためのインスタンスロックを解放する。
   * @returns {void}
   * @memberof Main
   */
  private purgeSingleInstanceLock(): void {
    try {
      App.releaseSingleInstanceLock();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description 多重起動の場合，エラーダイアログを表示して，アプリケーションを強制終了する。
   * @returns {void}
   * @memberof Main
   */
  private preventInstanceLock(): void {
    try {
      Log.warn('cannot get app instance lock!');
      const window: BrowserWindow = new BrowserWindow(this.emptyWindowOptions);
      this.showDialog(window, {
        buttons: [this.getLang('OK')],
        message: this.getLang('ERROR_APP_HAS_ALREADY_BEEN_RUNNING')
      });
      this.tryToCloseWindow(window);
      return this.forceExit(0);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @template T
   * @description get user config
   * @param {keyof IUserConfig} [key='state']
   * @param {*} [defaultValue=null]
   * @returns {T}
   * @memberof Main
   */
  private getUserConfig<T>(
    key: keyof IUserConfig = 'state',
    defaultValue: any = null
  ): T {
    try {
      return this.store.get(key, defaultValue) as T;
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }

  /**
   * @private
   * @description store user config
   * @memberof Main
   */
  private storeUserConfig(): void {
    try {
      if (this.isValidWindow(this.windows.main)) {
        const bounds: Rectangle = this.windows.main.getBounds();
        this.store.set('bounds', bounds);
        this.store.set('state', this.state);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @description set mute to `Webcontents` via `Javascript`.
   * @param {BrowserWindow} window
   * @param {boolean} [mute=true]
   * @memberof Main
   */
  private setMuteOnWebContents(
    window: BrowserWindow,
    mute: boolean = true
  ): void {
    try {
      this.runJavascriptOnWindow(
        window,
        `try { if (window.localStorage) { window.localStorage.setItem('sw_mute', ${mute}); window.localStorage.setItem('sww_mute', ${mute}); window.localStorage.setItem('mute', ${mute}); } } catch(e) {}`
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @description set volume to `Webcontents` via `Javascript`.
   * @param {BrowserWindow} window
   * @param {number} [volume=100]
   * @memberof Main
   */
  private setVolumeOnWebContents(
    window: BrowserWindow,
    volume: number = 100
  ): void {
    try {
      this.runJavascriptOnWindow(
        window,
        `if (window.localStorage) { window.localStorage.setItem('sw_sound', ${volume}); window.localStorage.setItem('sww_sound', ${volume}); window.localStorage.setItem('sound', ${volume}); }`
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description set `LocalShortcut` on `BrowserWindow`
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private setLocalShortcut(window: BrowserWindow): void {
    try {
      if (!this.options.shortcut.useGlobal) {
        if (this.isValidWindow(window)) {
          const map: (...args) => any = ([k, v]: [
            IAcceleratorAlias,
            Accelerator
          ]) => {
            switch (k) {
              case 'DEBUG':
                if (!LocalShortcut.isRegistered(window, v)) {
                  LocalShortcut.register(
                    window,
                    v,
                    this.openDevTools.bind(this, window)
                  );
                }
                break;

              case 'FLUSH':
                if (!LocalShortcut.isRegistered(v)) {
                  LocalShortcut.register(
                    window,
                    v,
                    this.flushBrowserWindowCache.bind(this, window)
                  );
                }
                break;

              case 'QUIT':
              case 'RELOAD':
              case 'FORCE-RELOAD':
                LocalShortcut.register(window, v, NOOP);
                break;
            }
          };
          _.toArray(this.accelerators.entries()).map(map);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description delete `LocalShortcut` on `BrowserWindow`
   * @param {BrowserWindow} window
   * @memberof Main
   */
  private unsetLocalShortcut(window: BrowserWindow): void {
    try {
      if (!this.options.shortcut.useGlobal) {
        if (this.isWindow(window)) {
          LocalShortcut.unregisterAll(window);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @private
   * @deprecated
   * @description get cookie value
   * @param {Session} context
   * @param {IFilter} [filter={}]
   * @returns {Promise<Cookie>}
   * @memberof Main
   */
  private getCookies(context: Session, filter: IFilter = {}): Promise<Cookie> {
    try {
      return Promisify(context.cookies.get).bind(context.cookies)(filter);
    } catch (error) {
      this.handleError(error);
      return Promise.resolve(null);
    }
  }

  /**
   * @private
   * @description 言語キーワードを取得する。多言語ヘルパー。
   * @param {string} [key='']
   * @param {ITranslateReplacement} [replacement={}]
   * @param {ILocale} [lang=this.options.locale]
   * @returns {string}
   * @memberof Main
   */
  private getLang(
    key: string = '',
    replacement: ITranslateReplacement = {
      maxGameWindows: `${this.options.common.maxGameWindows}`
    },
    lang: ILocale = this.options.common.locale
  ): string {
    try {
      const locales: ILocale = LOCALES[lang] || LOCALES.EN;
      const found: string = _.keys(locales).find(
        (k: string) => `${k}`.toUpperCase() === `${key}`.toUpperCase()
      );

      let result: string = _.isUndefined(found) ? key : locales[key];
      _.keys(replacement).map(
        (k: string) =>
          (result = `${result}`.replace(`{{${k}}}`, replacement[k]))
      );

      return result;
    } catch (error) {
      this.handleError(error);
      return key;
    }
  }

  /**
   * @private
   * @description ダイアログボックスを表示する。返り値は押下したボタンのインデックス（数字）
   * @param {BrowserWindow} window hostされる `BrowserWindow`
   * @param {MessageBoxSyncOptions} [options={
   *     message: '',
   *     buttons: [this.getLang('OK')]
   *   }]
   * @returns {number}
   * @memberof Main
   */
  private showDialog(
    window: BrowserWindow,
    options: MessageBoxSyncOptions = {
      message: '',
      buttons: [this.getLang('OK')]
    }
  ): number {
    try {
      if (this.state.isReady && this.isValidWindow(window)) {
        return Dialog.showMessageBoxSync(window, options);
      }

      return -1;
    } catch (error) {
      this.handleError(error);
      return -1;
    }
  }

  /**
   * @deprecated
   * @description 再起動処理。本来必要ない。
   * @private
   * @memberof Main
   */
  private relaunch(): void {
    try {
      App.relaunch();
      App.exit(0);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   * @private
   * @description `Cache/Session`のクリア
   * @memberof Main
   */
  private clearAllCache(session: Session = this.defaultSession): void {
    try {
      session.clearCache(NOOP);
      session.clearHostResolverCache(NOOP);
      session.clearStorageData({}, NOOP);
      session.flushStorageData();
      session.clearAuthCache().catch(NOOP);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   *
   *
   * @private
   * @description `Error`メッセージをサーバーに送信する。
   * @param {Error} err
   * @memberof Main
   */
  private sendLog2Server(err: Error): void {
    try {
      if (_.isError(err)) {
        const payload: any = {
          err: `${err.message}(${err.stack})`
        };

        return Superagent.post(`${this.options.url.error}`)
          .send(payload)
          .then(Log.warn.bind(Log))
          .catch(Log.error.bind(Log));
      }
    } catch (error) {
      Log.error(error);
    }
  }

  /**
   * @private
   * @description エラーログを送信/保存する。
   * @param {Error} err
   * @memberof Main
   */
  private handleError(err: Error): void {
    try {
      if (_.isError(err)) {
        Log.error(err);
        Sentry.captureException(err);
        this.sendLog2Server(err);
      }
    } catch (error) {
      Log.error(error);
    }
  }
}

try {
  const instance = new Main();
  Log.debug(instance.options);
} catch (error) {
  Log.error(error);
}
