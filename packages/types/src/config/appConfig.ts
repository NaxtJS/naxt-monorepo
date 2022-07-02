import type { Path } from "@naxt/runtime";
import type { Plugin } from "../plugin";
import type { Promisify } from "../utils/promisify";
import type { MinifyOptions as TerserMinifyOptions } from "terser";

export type ScriptTypes =
  | "application/javascript"
  | "application/ecmascript"
  | "text/javascript"
  | "text/ecmascript"
  | "module";

export interface Script {
  src: string;
  async: boolean;
  crossorigin: boolean;
  defer: boolean;
  integrity: string;
  module: boolean;
  type: ScriptTypes;
}

export interface Link {
  href: string;
  media: string;
}

export type SelfOrAsFunction<T> = T | ((page: string) => T);

export interface Head {
  title: SelfOrAsFunction<string>;
  meta: SelfOrAsFunction<Record<string, string>>;
  scripts: SelfOrAsFunction<(Script | string)[]>;
  styles: SelfOrAsFunction<(Link | string)[]>;
}

export interface JsonOptions {
  stringify: boolean;
  namedExports: boolean;
}

export interface PolyfillOptions {}

export interface BuildOptions {
  dir: string;
  polyfill: boolean | PolyfillOptions;
  isSSR: boolean;
  json: JsonOptions;
  minify: boolean | TerserMinifyOptions;
}

export interface CacheOptions {
  dir: string;
}

export type Parsers = "@naxt/parser-rollup" | "rollup";

export interface AppConfig {
  head: Head;
  plugins: Plugin[];
  build: BuildOptions;
  cache: CacheOptions;
  aliases: Record<string, string>;
  moduleMapper: Record<string, string>;
  parser: Parsers;
}

export interface Parser {
  bundle(pages: Path<any>[]): Promisify<void>;
}
