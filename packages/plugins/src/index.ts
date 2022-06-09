import { Plugin } from "rollup";
import { worker } from "./workerPlugin";
import { typescript } from "./plugins/typescript";

export const resolvePlugins = (): Plugin[] => {
  const isBuild = config.getConfig("isBuild");
  const plugins: Plugin[] = [];

  plugins.push(typescript());
  plugins.push(worker());
  plugins.push(nodeResolve({ browser: true }));
  plugins.push(commonjs());
  plugins.push(worker.post());
  // plugins.push(terser());

  return plugins;
};

export const ENTRYPOINT_BASENAME = "naxt:entry";
export const NULL_CHAR = String.fromCharCode(0x00);
export { worker } from "./workerPlugin";
