import { Config, Naxt } from "@naxt/core";
import { BaseConfig, NaxtConfig } from "@naxt/types";

export const config = new Config<BaseConfig>();

export const naxt = (naxtConfig: NaxtConfig) => new Naxt(naxtConfig);
export const NULL_CHAR = String.fromCharCode(0x0000);

export { defaultAppConfig } from "@naxt/core";
export { resolveConfig, Path, getPages, StringBuilder, generateHash } from "@naxt/utils";
export { NaxtConfig, Plugin, Logger, LoggerLevels } from "@naxt/types";
export { resolvePlugins, worker, ENTRYPOINT_BASENAME } from "@naxt/plugins";
