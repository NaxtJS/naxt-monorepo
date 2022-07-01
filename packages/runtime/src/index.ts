import { Config, Naxt } from "@naxt/core";
import { BaseConfig, NaxtConfig } from "@naxt/types";

export const config = new Config<BaseConfig>();

export const naxt = (naxtConfig: NaxtConfig) => new Naxt(naxtConfig);
export const NULL_CHAR = String.fromCharCode(0x0000);

/* Core */
export { defaultAppConfig } from "@naxt/core";

/* Utils */
export { resolveConfig, Path, getPages, StringBuilder, generateHash } from "@naxt/utils";
export { sortUserPlugins, stripBOM } from "@naxt/utils";

/* Plugins */
export { resolvePlugins, PluginHelper, ENTRYPOINT_BASENAME } from "@naxt/plugins";

/* Servers */
export * from "@naxt/servers";
