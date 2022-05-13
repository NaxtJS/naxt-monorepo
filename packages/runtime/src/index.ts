import { Config, Naxt } from "@naxt/core";
import { BaseConfig, NaxtConfig } from "@naxt/types";

export const config = new Config<BaseConfig>();

export const naxt = (naxtConfig: NaxtConfig) => new Naxt(naxtConfig);

export { defaultAppConfig } from "@naxt/core";
export { resolveConfig } from "@naxt/utils";
