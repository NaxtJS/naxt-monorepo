import { config, Plugin } from "@naxt/runtime";
import { transpileModule } from "typescript";
import { Path } from "@naxt/utils";

export const typescript = (): Plugin => {
  return {
    name: "naxt:typescript-plugin",

    resolveId(id) {
      const path = Path.from(id);

      if (path.extension.isSameTo("ts")) {
        return path.pathWithQuery;
      }
    },

    load(id) {
      const path = Path.from(id);

      if (path.extension.isSameTo("ts")) {
        return path.source.read();
      }
    },

    transform(code, id) {
      const path = Path.from(id);
      const rootTsConfigFile = config.getConfig("appRoot").duplicateTo("tsconfig.json");
      const tsConfig = rootTsConfigFile.exists ? rootTsConfigFile.source.readAsJSON() : {};
      tsConfig.compilerOptions ||= {};
      tsConfig.compilerOptions.module = "ESNext";
      tsConfig.compilerOptions.target = "ESNext";

      if (path.extension.isSameTo("ts")) {
        return transpileModule(code, { compilerOptions: tsConfig.compilerOptions }).outputText;
      }
    }
  };
};
