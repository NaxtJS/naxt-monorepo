import { Config, Naxt } from "@naxt/core";
import { BaseConfig, NaxtConfig } from "@naxt/types";

export const config = new Config<BaseConfig>();

export const naxt = (naxtConfig: NaxtConfig) => new Naxt(naxtConfig);
export const NULL_CHAR = String.fromCharCode(0x0000);

export { defaultAppConfig } from "@naxt/core";
export { resolveConfig, Path, getPages } from "@naxt/utils";
export { NaxtConfig } from "@naxt/types";
export { parse } from "@naxt/parser";
export { generate } from "@naxt/generator";
export { resolvePlugins } from "@naxt/plugins";
