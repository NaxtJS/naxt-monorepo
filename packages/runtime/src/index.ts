import { Config, Naxt } from "@naxt/core";
import { BaseConfig, NaxtConfig } from "@naxt/types";

export const config = new Config<BaseConfig>();

export const naxt = (naxtConfig: NaxtConfig) => new Naxt(naxtConfig);

export { defaultAppConfig } from "@naxt/core";
export { resolveConfig, Path, getPages } from "@naxt/utils";
export { NaxtConfig } from "@naxt/types";
export { parse } from "@naxt/parser";
export { generate } from "@naxt/generator";
