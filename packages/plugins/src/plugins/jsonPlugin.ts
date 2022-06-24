import { dataToEsm } from "@rollup/pluginutils";
import type { Plugin } from "@naxt/runtime";
import { config, Path, stripBOM } from "@naxt/runtime";

export const jsonPlugin = (): Plugin => {
  const { isBuild, appConfig } = config.getConfigs(["isBuild", "appConfig"]);
  const jsonOptions = appConfig.build.json;

  return {
    name: "naxt-json-plugin",

    transform(code, source) {
      const path = Path.from(source);
      const json = stripBOM(code);

      if (!path.extension.isSameToOneOf(["json", "json5"])) return;

      try {
        if (jsonOptions.stringify) {
          if (isBuild) {
            return {
              // during build, parse then double-stringify to remove all
              // unnecessary whitespaces to reduce bundle size.
              code: `export default JSON.parse(${JSON.stringify(
                JSON.stringify(JSON.parse(json))
              )})`,
              map: { mappings: "" }
            };
          } else {
            return `export default JSON.parse(${JSON.stringify(json)})`;
          }
        }

        const parsed = JSON.parse(json);
        return {
          code: dataToEsm(parsed, { preferConst: true, namedExports: jsonOptions.namedExports }),
          map: { mappings: "" }
        };
      } catch (e) {
        const errorMessageList = /\d+/.exec(e.message);
        const position = errorMessageList && parseInt(errorMessageList[0], 10);
        const msg = position ? `, invalid JSON syntax found at line ${position}` : `.`;
        this.error(`Failed to parse JSON file${msg}`, e.idx);
      }
    }
  };
};
