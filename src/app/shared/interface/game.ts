import { TIso6391 } from '@shared/type/iso639-1';
import { MomentInput } from 'moment';

/**
 *
 *
 * @export
 * @interface IGameFeatureLiveProviderSettings
 */
export interface IGameFeatureLiveProviderSettings {
  source: string;
  stream: string;
}

/**
 *
 *
 * @export
 * @interface IGameFeatureLive
 */
export type TGameFeatureLiveType = 'roulette' | 'blackjack' | 'baccarat';

/**
 *
 *
 * @export
 * @interface IGameFeatureLive
 */
export interface IGameFeatureLive {
  tableId: string | number;
  provider: string;
  providerSettings: IGameFeatureLiveProviderSettings;
  type?: TGameFeatureLiveType;
  tableTime?: string;
}

/**
 *
 *
 * @export
 * @interface IGameFeatures
 */
export interface IGameFeatures {
  live?: IGameFeatureLive;
  isBonusCoinsSupported?: boolean;
}

/**
 *
 *
 * @export
 * @interface IGameLimitBet
 */
export interface IGameLimitBet {
  exposure: number;
  min: number;
  max: number;
}

/**
 *
 *
 * @export
 * @interface IGameLimitBets
 */
export interface IGameLimitBets {
  anyPair: IGameLimitBet;
  banker: IGameLimitBet;
  bankerPair: IGameLimitBet;
  big: IGameLimitBet;
  egalite: IGameLimitBet;
  perfectPair: IGameLimitBet;
  player: IGameLimitBet;
  playerPair: IGameLimitBet;
  small: IGameLimitBet;
  super6: IGameLimitBet;
  tie: IGameLimitBet;
}

/**
 *
 *
 * @export
 * @interface IGameLimit
 */
export interface IGameLimit {
  bets: IGameLimitBets;
  stakeAll: number[];
  stakeDef: number;
  stakeMax: number;
  stakeMin: number;
  totalStakeMax: number;
  totalStakeMin: number;
}

/**
 *
 *
 * @export
 * @interface IGameBets
 */
export interface IGameBets {
  _?: any;
}

/**
 *
 *
 * @export
 * @interface IGameLimits
 */
export interface IGameLimits {
  bets?: IGameBets;
  high?: IGameLimit;
  mid?: IGameLimit;
  low?: IGameLimit;
  stakeDef?: number;
  coinsRate?: number;
  stakeMax?: number;
  stakeMin?: number;
  winMax?: number;
  maxTotalStake?: number;
  coins?: number[];
  stakeAll?: number[];
}

/**
 *
 *
 * @export
 * @interface IGameGroupLimits
 */
export interface IGameGroupLimits {
  [key: string]: IGameLimits;
}

/**
 *
 *
 * @export
 * @interface IGameLimitsPerCurrency
 */
export interface IGameLimitsPerCurrency {
  JPY?: IGameLimits;
  CNY?: IGameLimits;
  USD?: IGameLimits;
}

/**
 *
 *
 * @export
 * @interface IGame
 */
export interface IGame {
  clientFeatures: any;
  code: string;
  comment: string;
  countries?: any[];
  defaultInfo: any;
  features: IGameFeatures;
  info: any;
  jackpots: any;
  labels: any[];
  limits?: IGameLimitsPerCurrency;
  limitsGroup?: any;
  providerCode: string;
  providerTitle: string;
  releaseDate: Date;
  schemaDefinitionId?: any;
  status: 'normal';
  title: string;
  totalBetMultiplier: number;
  type: 'slot' | 'table' | 'action';
  url?: string;
}

/**
 *
 *
 * @export
 * @interface IGameLocale
 */
export interface IGameLocale {
  code: TIso6391;
}

/**
 *
 *
 * @export
 * @interface IGameLocales
 */
export interface IGameLocales {
  defaultLocale: TIso6391;
  list: IGameLocale[];
}

/**
 *
 *
 * @export
 * @interface IGameMeta
 */
export interface IGameMeta {
  icon: {
    exists: boolean;
  };
  logo: {
    exists: boolean;
  };
  poster: {
    exists: boolean;
  };
  screenshots: {
    exists: boolean;
  };
  screenshots_hd: {
    exists: boolean;
  };
  videos: {
    exists: boolean;
  };
}

/**
 *
 *
 * @export
 * @interface IGameSetting
 */
export interface IGameSetting {
  id: string;
  date_iso8601: TIso6391;
  priority: number;
  provider: string;
  title: string;
  type: string;
  short_desc: string;
  description: string;
  meta: IGameMeta;
  images: { [T in keyof IGameMeta]: string };
  screenshots: {
    [key: string]: string;
  };
  screenshots_hd: {
    [key: string]: string;
  };
  orientation: any;
  videos: string[];
}

/**
 *
 *
 * @export
 * @interface IGameSettings
 */
export interface IGameSettings {
  language: TIso6391;
  games: ({ [key: string]: IGameSetting })[];
  total: number;
}

/**
 *
 *
 * @export
 * @interface IGameUrl
 */
export interface IGameUrl {
  token: string;
  url: string;
}

/**
 *
 *
 * @export
 * @interface IPTLiveGameDealer
 */
export interface IPTLiveGameDealer {
  name: string;
  picture: string;
}

/**
 *
 *
 * @export
 * @interface IPTLiveGameSettings
 */
export interface IPTLiveGameSettings {
  casinoCode: string | number;
  source: string;
}

/**
 *
 *
 * @export
 * @interface IPTLiveGame
 */
export interface IPTLiveGame {
  id: string | number;
  provider: string;
  type: number;
  dealer: IPTLiveGameDealer;
  status: 'online' | 'offline';
  settings: IPTLiveGameSettings;
  scoreboard: string;
}

/**
 *
 *
 * @export
 * @interface IGameCategoryItem
 */
export interface IGameCategoryItem {
  id: string;
  type: string;
}

/**
 *
 *
 * @export
 * @interface IGameCategory
 */
export interface IGameCategory {
  id: string;
  title: string;
  description: string;
  brandId: string;
  status: any;
  isEntityOwner: boolean;
  ordering: number;
  items: IGameCategoryItem[];
  type: string;
}

/**
 *
 *
 * @export
 * @interface IGamesWithExpiration
 */
export interface IGamesWithExpiration {
  games: IGame[];
  createdAt: MomentInput;
}

/**
 *
 *
 * @export
 * @interface IGameRequest
 */
export interface IGameRequest {
  title?: string;
  gameCode?: string;
  url?: string;
  se?: boolean;
  bgm?: boolean;
  volume?: number;
}
