import { Path, Plugin } from "@naxt/runtime";
import postcssModules from "postcss-modules";
import postcss from "postcss";
import { generateHash } from "@naxt/utils";

export const cssPlugin = (): Plugin => {
  const sassExtensions = ["scss", "sass"];
  const cssExtensions = ["css", ...sassExtensions];
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

      if (sourcePath.extension.isSameToOneOf(cssExtensions)) {
        const isModule = sourcePath.extension.isSameToOneOf(
          cssExtensions.map(ext => `.module.${ext}`)
        );

        const postcssPlugins = [];
        let json: Record<string, string> = {};

        if (isModule) {
          postcssPlugins.push(postcssModules({ getJSON: (_, _json) => (json = _json) }));
        }

        const postcssInstance = postcss(...postcssPlugins);
        const { css } = await postcssInstance.process(code, { from: source, map: false });

        if (source in cached.positions) {
          cached.fragments[cached.positions[source]] = css;
        } else {
          cached.positions[source] = cached.fragments.length;
          cached.fragments.push(css);
        }

        if (isModule) return `export default ${JSON.stringify(json)};`;
        return { code: ``, moduleSideEffects: true };
      }
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
          fileName: `style.${hash}.css`,
          name: `style.${hash}`,
          source: code
        });
    }
  };
};
