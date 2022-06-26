import type { Path, Plugin } from "@naxt/runtime";
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
  terserOptions: boolean | TerserMinifyOptions;
}

export interface CacheOptions {
  dir: string;
}

export type Parsers = "@naxt/parser-rollup";

export interface ParserOutput<P, O> {
  parser: P;
  parserOptions: O;
}

export interface Parser<P = any, O = any> {
  parse(pages: Path<any>[]): Promisify<ParserOutput<P, O>>;
  generate(
    parser: Awaited<ReturnType<this["parse"]>>["parser"],
    parserOptions: Awaited<ReturnType<this["parse"]>>["parserOptions"]
  ): Promisify<void>;
}

export interface AppConfig {
  head: Head;
  plugins: Plugin[];
  build: BuildOptions;
  cache: CacheOptions;
  aliases: Record<string, string>;
  moduleMapper: Record<string, string>;
  parser: Parsers;
}
