import { generateHash, Path } from "@naxt/runtime";
import { Plugin } from "@naxt/types";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import MagicString from "magic-string";

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
  const cached = {
    positions: {},
    fragments: [],
    get code() {
      return this.fragments.join("");
    },
    get hash() {
      return generateHash(this.code);
    }
  };

  return {
    name: "naxt:css-plugin",

    async transform(code, source) {
      const sourcePath = Path.from(source);
      if (!sourcePath.extension.isSameToOneOf(cssExtensions)) return;

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

      if (source in cached.positions) {
        cached.fragments[cached.positions[source]] = css;
      } else {
        cached.positions[source] = cached.fragments.length;
        cached.fragments.push(css);
      }

      if (isModule) {
        const jsCssMap = `export default ${JSON.stringify(json)};`;
        const ms = new MagicString(jsCssMap);
        return { code: ms.toString(), map: ms.generateMap({ hires: true }) };
      }
      return { code: ``, moduleSideEffects: true };
    },

    renderChunk(_code, chunk) {
      const hash = cached.hash;
      const entrypoint = chunk.getEntrypoint();
      if (entrypoint) {
        chunk.getMetadata(entrypoint).importedCss.add(`assets/style.${hash}.css`);
      }

      return null;
    },

    generateBundle() {
      const code = cached.code;
      const hash = cached.hash;

      code.length &&
        this.emitFile({
          type: "asset",
          name: `style.${hash}`,
          fileName: `assets/style.${hash}.css`,
          source: code
        });
    }
  };
};
