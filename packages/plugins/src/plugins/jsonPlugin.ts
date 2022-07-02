import { dataToEsm } from "@rollup/pluginutils";
import type { Plugin } from "@naxt/types";
import { config, Path, stripBOM } from "@naxt/runtime";
import MagicString from "magic-string";

export const jsonPlugin = (): Plugin => {
  const { isBuild, appConfig } = config.getConfigs(["appConfig", "isBuild"]);
  const jsonOptions = appConfig.build.json;

  return {
    name: "naxt-json-plugin",

    transform(code, source) {
      const path = Path.from(source);
      const json = stripBOM(code);

      if (!path.extension.isSameToOneOf(["json", "json5"])) return;
      let resultCode: string;

      try {
        resultCode = jsonOptions.stringify
          ? isBuild
            ? `export default JSON.parse(${JSON.stringify(JSON.stringify(JSON.parse(json)))})`
            : `export default JSON.parse(${JSON.stringify(json)})`
          : dataToEsm(JSON.parse(json), {
              preferConst: true,
              namedExports: jsonOptions.namedExports
            });
      } catch (e) {
        const errorMessageList = /\d+/.exec(e.message);
        const position = errorMessageList && parseInt(errorMessageList[0], 10);
        const msg = position ? `, invalid JSON syntax found at line ${position}` : `.`;
        this.error(`Failed to parse JSON file${msg}`, e.idx);
      }

      const ms = new MagicString(resultCode);
      return { code: ms.toString(), map: ms.generateMap({ hires: true }) };
    }
  };
};
