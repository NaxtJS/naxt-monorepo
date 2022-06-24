import { Path, Plugin } from "@naxt/runtime";

export const resolvePathPlugin = (): Plugin => {
  return {
    name: "naxt-resolve-plugin",

    resolveId(source, importer) {
      if (source.startsWith(".")) {
        return Path.from(importer).duplicateTo(source).source.findFile().fullImportPath;
      }
    }
  };
};
