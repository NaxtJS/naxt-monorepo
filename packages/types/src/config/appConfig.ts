import { Path, Plugin } from "@naxt/runtime";
import { Promisify } from "../utils/promisify";

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

export interface BuildOptions {
  dir: string;
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
  parser: Parsers;
}
