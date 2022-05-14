import { Plugin } from "rollup";
import { config } from "@naxt/runtime";
import {} from "typescript";

// plugins
import typescript from "@rollup/plugin-typescript";

export const resolvePlugins = (): Plugin[] => {
  const rootTsConfigFile = config.getConfig("appRoot").duplicateTo("tsconfig.json");
  const tsConfig = rootTsConfigFile.exists ? rootTsConfigFile.source.readAsJSON() : {};
  tsConfig.module = "esnext";

  return [typescript({ ...tsConfig })];
};
