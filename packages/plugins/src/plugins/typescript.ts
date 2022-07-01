import { Plugin } from "@naxt/types";
import { config, Path } from "@naxt/runtime";
import { transpileModule } from "typescript";
import { RollupWarning } from "rollup";
import MagicString from "magic-string";

export const typescript = (): Plugin => {
  let tsConfigExistsWarn = false;
  let tsConfigModuleTargetWarn = false;

  const rootTsConfigFile = config.getConfig("appRoot").duplicateTo("tsconfig.json");
  const tsConfig = rootTsConfigFile.exists ? rootTsConfigFile.source.readAsJSON() : {};

  if (
    tsConfig?.compilerOptions?.module?.toLowerCase() !== "esnext" ||
    tsConfig?.compilerOptions?.target?.toLowerCase() !== "esnext"
  ) {
    tsConfigModuleTargetWarn = true;
  }
  tsConfigExistsWarn = !rootTsConfigFile.exists;

  tsConfig.compilerOptions ||= {};
  tsConfig.compilerOptions.module = "ESNext";
  tsConfig.compilerOptions.target = "ESNext";

  return {
    name: "naxt-typescript-plugin",

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

    transform(code, source) {
      const sourcePath = Path.from(source);
      if (!sourcePath.extension.isSameTo("ts")) return;
      const warning: RollupWarning = {
        name: "naxt:typescript-plugin",
        chunkName: "naxt:typescript-plugin",
        id: source,
        code,
        message: ""
      };

      if (tsConfigExistsWarn) {
        this.warn({
          ...warning,
          message: "TSConfig not found. Will be used default values"
        });

        tsConfigExistsWarn = false;
        tsConfigModuleTargetWarn = false;
      } else if (tsConfigModuleTargetWarn) {
        this.warn({
          ...warning,
          message:
            "tsconfig.compilerOptions.(module|target) is not ESNext. It will be changed automatically"
        });
        tsConfigModuleTargetWarn = false;
      }

      const compiledCode = transpileModule(code, { compilerOptions: tsConfig.compilerOptions });
      const ms = new MagicString(compiledCode.outputText);
      return { code: ms.toString(), map: ms.generateMap({ hires: true }) };
    }
  };
};
