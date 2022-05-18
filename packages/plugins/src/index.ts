import { Plugin } from "rollup";
import { config } from "@naxt/runtime";

// Internal Plugins
import { worker } from "./workerPlugin";

// External plugins
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export const resolvePlugins = (): Plugin[] => {
  const rootTsConfigFile = config.getConfig("appRoot").duplicateTo("tsconfig.json");
  const tsConfig = rootTsConfigFile.exists ? rootTsConfigFile.source.readAsJSON() : {};
  tsConfig.compilerOptions ||= {};
  tsConfig.compilerOptions.module = "ESNext";
  tsConfig.compilerOptions.target = "ESNext";

  return [typescript({ ...tsConfig }), worker(), worker.post()];
};
