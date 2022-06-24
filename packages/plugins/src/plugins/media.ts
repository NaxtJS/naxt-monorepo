import { config, generateHash, Path, Plugin } from "@naxt/runtime";

export const media = (): Plugin => {
  const assets = new Map<string, string>();
  const imageMediaMimeTypes = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
  const mimeTypes = [...imageMediaMimeTypes];

  return {
    name: "naxt:media-plugin",

    resolveId(source) {
      const sourcePath = Path.from(source);
      if (sourcePath.extension.isSameToOneOf(mimeTypes)) {
        return source;
      }
    },

    load(source) {
      const sourcePath = Path.from(source);

      if (sourcePath.extension.isSameToOneOf(mimeTypes)) {
        const hash = generateHash(sourcePath.source.readAsBase64());
        const asset = `${sourcePath.basename}.${hash}.${sourcePath.extension}`;
        assets.set(sourcePath.fullPath, asset);
        return `export default "/assets/${asset}"`;
      }
    },

    generateBundle() {
      const { build } = config.getConfig("appConfig");

      assets.forEach((destination, source) => {
        Path.from(source).copyTo(Path.from(`assets/${destination}`, build.dir));
      });
    }
  };
};
