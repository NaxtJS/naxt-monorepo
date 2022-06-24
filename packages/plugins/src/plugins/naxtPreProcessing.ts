import type { Plugin } from "@naxt/runtime";

export const naxtPreProcessing = (): Plugin => {
  return {
    name: "naxt-pre-processing-plugin",

    renderChunk(code, chunk) {
      chunk.getEntrypoint = function () {
        if (this.facadeModuleId) {
          return this.facadeModuleId;
        }

        return null;
      };

      return null;
    }
  };
};
