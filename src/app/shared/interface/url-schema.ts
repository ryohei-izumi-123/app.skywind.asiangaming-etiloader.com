/**
 *
 *
 * @export
 * @interface IUrlSchema
 */
export interface IUrlSchemaMap<T> {
  [key: string]: T;
}

/**
 *
 *
 * @export
 * @interface IUrlSchema
 */
export interface IUrlSchema {
  protocol?: string;
  auth?: string;
  username?: string;
  password?: string;
  host?: string;
  hostname?: string;
  port?: number;
  pathname?: string;
  query?: IUrlSchemaMap<string>;
  hash?: string;
  href?: string;
  origin?: string;
  slashes?: boolean;
  set?: (key: string, value: string) => void;
  toString?: () => string;
}
