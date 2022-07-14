import type { Plugin } from "@naxt/types";
import { generateHash, Path } from "@naxt/runtime";
import { RollupOptions } from "rollup";

// ToDo: move to types package
export interface MediaPluginOptions {
  outputDir: string;
}

export const mediaPlugin = (options: MediaPluginOptions): Plugin => {
  const assets = new Map<string, string>();
  const imageMediaMimeTypes = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
  const mediaExtensions = [...imageMediaMimeTypes];
  let fileTemplate: string;

  return {
    name: "naxt:media-plugin",

    options(options: RollupOptions) {
      const outputOptions = Array.isArray(options.output) ? options.output : [options.output];

      fileTemplate =
        outputOptions.find(option => option.nonAssetFile)?.nonAssetFile || "[name].[hash].[ext]";
    },

    resolveId(source) {
      const sourcePath = Path.from(source);
      if (sourcePath.extension.isSameToOneOf(mediaExtensions)) return source;
    },

    load(source) {
      const sourcePath = Path.from(source);

      if (sourcePath.extension.isSameToOneOf(mediaExtensions)) {
        const hash = generateHash(sourcePath.source.readAsBase64());
        const asset = fileTemplate
          .replace("[name]", sourcePath.basename)
          .replace("[hash]", hash)
          .replace("[ext]", sourcePath.extension);
        assets.set(sourcePath.fullPath, asset);
        return `export default "/assets/${asset}"`;
      }
    },

    renderChunk(_code, chunk) {
      const entrypoint = chunk.getEntrypoint();

      if (entrypoint) {
        assets.forEach((asset, source) => {
          Object.keys(chunk.modules).includes(source) &&
            (chunk.getMetadata(entrypoint).importedAssets[`assets/${asset}`] = { type: "image" });
        });
      }

      return null;
    },

    generateBundle() {
      assets.forEach((destination, source) => {
        Path.from(source).copyTo(Path.from(`assets/${destination}`, options.outputDir));
      });
    }
  };
};
