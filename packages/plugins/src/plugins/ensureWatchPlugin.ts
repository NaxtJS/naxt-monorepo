import type { Plugin } from "@naxt/types";

/**
 * ToDo: WIP: Will be implemented in future
 */
export const ensureWatchPlugin = (): Plugin => {
  return {
    name: "naxt-ensure-watch-plugin",

    buildStart() {
      const watchFileFunction = this.addWatchFile;
      this.addWatchFile = function customizedAddWatchFile(filePath) {
        console.log(filePath);
        watchFileFunction(filePath);
      }.bind(this);
    }
  };
};
