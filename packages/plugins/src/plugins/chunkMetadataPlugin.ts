import type { Plugin } from "@naxt/types";

export function chunkMetadataPlugin(): Plugin {
  return {
    name: "naxt-chunk-build-metadata-plugin",

    renderChunk(_code, chunk) {
      chunk.naxtMetadata ||= {};
      chunk.getMetadata = module => {
        return (
          chunk.naxtMetadata[module] ||
          (chunk.naxtMetadata[module] = { importedAssets: {}, importedCss: new Set() })
        );
      };

      chunk.getEntrypoint = function () {
        if (this.facadeModuleId) {
          return this.facadeModuleId;
        }
      };

      return null;
    }
  };
}
