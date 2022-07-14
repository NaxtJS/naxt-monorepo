import { config, generateHash, Path, PluginHelper } from "@naxt/runtime";
import type { Plugin } from "@naxt/types";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import MagicString from "magic-string";
import { pluginsModuleGraph } from "..";
import { RollupOptions } from "rollup";

/*
...stylusExtensions
const stylusExtensions = ["styl", "stylus"];
if (sourcePath.extension.isSameToOneOf(stylusExtensions)) {
  const { css } = require("stylus").render(code);
  code = css;
}
 */

export const cssPlugin = (): Plugin => {
  const sassExtensions = ["scss", "sass"];
  const lessExtensions = ["less"];
  const cssExtensions = ["css", "pcss", "postcss", ...sassExtensions, ...lessExtensions];
  const sourceMap: Record<string, Set<string>> = {};
  const sourceCode: Record<
    string,
    { position: Record<string, number>; fragments: string[]; styleFileName: string }
  > = {};
  let fileTemplate: string;

  return {
    name: "naxt:css-plugin",

    options(options: RollupOptions) {
      const outputOptions = Array.isArray(options.output) ? options.output : [options.output];

      fileTemplate =
        outputOptions.find(option => option.nonAssetFile)?.nonAssetFile ||
        "assets/[name].[hash].[ext]";
    },

    async transform(code, source) {
      const sourcePath = Path.from(source);
      if (!sourcePath.extension.isSameToOneOf(cssExtensions)) return;
      sourceMap[source] ||= new Set();
      pluginsModuleGraph.getRootParent(source).forEach(parent => {
        sourceMap[source].add(parent);
      });

      const postcssPlugins = [];
      const isModule = sourcePath.extension.isSameToOneOf(
        cssExtensions.map(ext => `.module.${ext}`)
      );
      let json: Record<string, string> = {};

      if (isModule) {
        postcssPlugins.push(postcssModules({ getJSON: (_, _json) => (json = _json) }));
      }

      if (sourcePath.extension.isSameToOneOf(sassExtensions)) {
        const { css, loadedUrls, sourceMap } = await require("sass").compileString(code);
        code = css;
        // ToDO: handle loadedUrls
      }

      if (sourcePath.extension.isSameToOneOf(lessExtensions)) {
        const { css, imports } = await require("less").render(code);
        code = css;
        // ToDO: handle imports
      }

      const postcssInstance = postcss(...postcssPlugins);
      const { css } = await postcssInstance.process(code, { from: source, map: false });
      sourceCode[source] ||= { position: {}, fragments: [], styleFileName: "" };

      if (source in sourceCode[source].position) {
        sourceCode[source].fragments[sourceCode[source].position[source]] = css;
      } else {
        sourceCode[source].position[source] = sourceCode[source].fragments.length;
        sourceCode[source].fragments.push(css);
      }

      if (isModule) {
        const jsCssMap = `export default ${JSON.stringify(json)};`;
        const ms = new MagicString(jsCssMap);
        return { code: ms.toString(), map: ms.generateMap({ hires: true }) };
      }
      return { code: ``, moduleSideEffects: true };
    },

    renderChunk(_code, chunk) {
      const entrypoint = chunk.getEntrypoint();
      const root = config.getConfig("appRoot").duplicateTo("pages").fullPath;

      if (entrypoint) {
        const fullPath = PluginHelper.cleanInputFile(entrypoint).fullPath;
        Object.entries(sourceMap).forEach(([source, parents]) => {
          parents.forEach(parent => {
            if (parent === fullPath) {
              const page = Path.from(parent).assignRoot(root).importPath;
              const pageDirname = page.split("/").slice(0, -1).join("/");
              const code = sourceCode[source].fragments.join("\n");
              const hash = generateHash(code);
              const basename = Path.from(parent).basename;

              const styleFileName = [
                pageDirname,
                fileTemplate
                  .replace("[name]", basename)
                  .replace("[hash]", hash)
                  .replace("[ext]", "css")
              ]
                .filter(Boolean)
                .join("/");
              sourceCode[source].styleFileName = styleFileName;
              chunk.getMetadata(entrypoint).importedCss.add(styleFileName);
            }
          });
        });
      }

      return null;
    },

    generateBundle() {
      Object.entries(sourceCode).forEach(([, { styleFileName, fragments }]) => {
        const code = fragments.join("\n");
        code.length &&
          this.emitFile({
            type: "asset",
            name: styleFileName.split(".").slice(0, -1).join("."),
            fileName: styleFileName,
            source: code
          });
      });
    }
  };
};
