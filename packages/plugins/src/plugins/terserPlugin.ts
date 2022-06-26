import { config, Plugin } from "@naxt/runtime";
import MagicString from "magic-string";

export const terserPlugin = (): Plugin => {
  const appConfig = config.getConfig("appConfig");
  const terserOptions = typeof appConfig.build.minify === "boolean" ? {} : appConfig.build.minify;

  return {
    name: "naxt-terser-plugin",

    async renderChunk(code, chunk, outputOptions) {
      const terser = require("terser");
      const minifiedCode = await terser.minify(code, {
        safari10: true,
        ...terserOptions,
        sourceMap: !!outputOptions.sourcemap,
        module: outputOptions.format.startsWith("es"),
        toplevel: outputOptions.format === "cjs"
      });
      const ms = new MagicString(minifiedCode.code);
      return { code: ms.toString(), map: ms.generateMap({ hires: true }) };
    }
  };
};
