import { Plugin } from "rollup";
import { WorkerPlugin } from "./workerPlugin";
import { typescript } from "./plugins/typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { config } from "@naxt/runtime";

/* Internal Plugins */
import { css } from "./plugins/css";
import { media } from "./plugins/media";

/* External Plugins */
import alias from "@rollup/plugin-alias";

export const resolvePlugins = (): Plugin[] => {
  const { isBuild, appConfig } = config.getConfigs(["isBuild", "appConfig"]);
  const plugins: Plugin[] = [];

  /* All */
  plugins.push(WorkerPlugin.preProcessing());
  plugins.push(alias({ entries: appConfig.aliases }));

  /* Media */
  plugins.push(css());
  plugins.push(media());

  /* JavaScript */
  plugins.push(typescript());
  plugins.push(WorkerPlugin.handleJSRules());
  plugins.push(nodeResolve({ browser: true }));
  plugins.push(commonjs());

  /* PostProcessing */
  plugins.push(WorkerPlugin.postProcessing());

  return plugins;
};

export const ENTRYPOINT_BASENAME = "naxt:entry";
export const NULL_CHAR = String.fromCharCode(0x00);
export { WorkerPlugin } from "./workerPlugin";
