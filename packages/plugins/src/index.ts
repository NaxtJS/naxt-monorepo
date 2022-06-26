import { PluginHelper } from "./pluginHelper";
import { config, Plugin, sortUserPlugins, ChunkMetadata } from "@naxt/runtime";
import { getBuildPlugins } from "./getBuildPlugins";

/* Internal Plugins */
import { ensureWatchPlugin } from "./plugins/ensureWatchPlugin";
import { chunkMetadataPlugin } from "./plugins/chunkMetadataPlugin";
import { polyfillPlugin } from "./plugins/polyfillPlugin";
import { cssPlugin } from "./plugins/cssPlugin";
import { mediaPlugin } from "./plugins/mediaPlugin";
import { typescript } from "./plugins/typescript";
import { jsonPlugin } from "./plugins/jsonPlugin";
import { naxtPreProcessing } from "./plugins/naxtPreProcessing";
import { naxtResolveEntries } from "./plugins/naxtResolveEntries";
import { naxtPostProcessing } from "./plugins/naxtPostProcessing";
import { terserPlugin } from "./plugins/terserPlugin";

/* External Plugins */
import aliasPlugin from "@rollup/plugin-alias";
import commonJsPlugin from "@rollup/plugin-commonjs";
import { nodeResolve as nodeResolvePlugin } from "@rollup/plugin-node-resolve";

declare module "rollup" {
  export interface RenderedChunk {
    naxtMetadata: Record<string, ChunkMetadata>;
    getMetadata(module: string): ChunkMetadata;
    getEntrypoint(this: RenderedChunk): string;
  }
}

export const resolvePlugins = (): Plugin[] => {
  const { isBuild, appConfig } = config.getConfigs(["isBuild", "appConfig"]);
  const isWatch = false;
  const userPlugins = sortUserPlugins(appConfig.plugins);
  const buildPlugins = getBuildPlugins() || { pre: [], post: [] };
  const plugins: Plugin[] = [];

  /* Pre */
  plugins.push(naxtPreProcessing());
  plugins.push(typescript());
  plugins.push(naxtResolveEntries());
  isWatch && plugins.push(ensureWatchPlugin());
  isBuild && plugins.push(chunkMetadataPlugin());
  plugins.push(aliasPlugin({ entries: appConfig.aliases }));
  plugins.push(resolvePathPlugin());
  plugins.push(nodeResolvePlugin());
  plugins.push(commonJsPlugin());
  plugins.push(media());
  plugins.push(...userPlugins.pre);
  appConfig.build.polyfill && plugins.push(polyfillPlugin());

  /* Normal */
  plugins.push(cssPlugin());
  plugins.push(jsonPlugin());
  plugins.push(...userPlugins.normal);
  plugins.push(...buildPlugins.pre);

  /* Post */

  plugins.push(...userPlugins.post);
  plugins.push(...buildPlugins.post);
  isBuild && appConfig.build.terserOptions && plugins.push(terserPlugin());

  /* Internal Post Processing Plugins */
  plugins.push(naxtPostProcessing());

  // internal Server Plugins
  // isBuild && plugins.push(clientInjectionsPlugin(), importAnalysisPlugin());

  return plugins;
};

export const ENTRYPOINT_BASENAME = "naxt:entry";
export const NULL_CHAR = String.fromCharCode(0x00);
export const MODULE_POLYFILL_ID = "naxt/module-polyfill";
export { PluginHelper } from "./pluginHelper";
