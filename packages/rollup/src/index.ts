import { OutputOptions, rollup, RollupOptions } from "rollup";
import { config, getPages, Path, PluginHelper, resolvePlugins } from "@naxt/runtime";
import rimraf from "rimraf";

declare module "rollup" {
  interface OutputOptions {
    nonAssetFile?: string;
  }
}

interface ResolveOptions {
  pages: Path<any>[];
  outputOptions?: OutputOptions | OutputOptions[];
  isBuild: boolean;
  isDev: boolean;
  isLibrary: boolean;
}

const resolveOptions = ({
  pages,
  outputOptions,
  isBuild,
  isDev,
  isLibrary
}: ResolveOptions): RollupOptions => ({
  input: isLibrary
    ? pages.map(page => page.fullPath)
    : pages.map(PluginHelper.transformToInputFile),
  onwarn(warning, handler) {},
  output: outputOptions
    ? outputOptions
    : {
        format: "esm",
        entryFileNames: chunkInfo =>
          PluginHelper.cleanInputFile(chunkInfo.facadeModuleId).extension.set(
            `${isDev ? "" : "[hash]"}.js`
          ).importPath,
        chunkFileNames: `assets/[name]${isDev ? "" : ".[hash]"}.js`,
        assetFileNames: `assets/[name]${isDev ? "" : ".[hash]"}.[ext]`,
        nonAssetFile: `[name]${isDev ? "" : ".[hash]"}.[ext]`,
        sourcemap: isBuild
      },
  plugins: resolvePlugins({ isLibrary })
});

export const bundle = async (outputDir?: string) => {
  const {
    appConfig,
    appConfig: { input },
    isBuild,
    isDev
  } = config.getConfigs(["appConfig", "isBuild", "isDev"]);
  outputDir = outputDir || appConfig.build.dir;

  const isLibrary = !!input;
  const pages = isLibrary
    ? (Array.isArray(input)
        ? input
        : typeof input === "object"
        ? Object.values(input)
        : [input]
      ).map(item => Path.from(item, config.getConfig("appRoot")))
    : getPages({ path: true, absolute: true });
  const rollupOptions = resolveOptions({
    pages,
    outputOptions: appConfig.output,
    isBuild,
    isDev,
    isLibrary
  });

  const bundle = await rollup(rollupOptions);
  const outputOptions = Array.isArray(rollupOptions.output)
    ? rollupOptions.output
    : [rollupOptions.output];

  rimraf.sync(outputDir);
  for (const outputOption of outputOptions) {
    const { output } = await bundle.generate(outputOption);

    for (const chunk of output) {
      const source =
        chunk.type === "chunk"
          ? chunk.code
          : chunk.type === "asset"
          ? typeof chunk.source === "string"
            ? chunk.source
            : new TextDecoder("utf-8").decode(chunk.source)
          : "";

      const filePath = Path.from(chunk.fileName, outputDir);
      filePath.source.saveFile(source);
    }
  }
};
