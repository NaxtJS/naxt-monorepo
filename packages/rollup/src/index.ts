import { rollup, RollupOptions } from "rollup";
import { config, Path, PluginHelper, resolvePlugins } from "@naxt/runtime";
import rimraf from "rimraf";

const resolveOptions = (pages: Path<any>[], isBuild: boolean): RollupOptions => ({
  input: pages.map(PluginHelper.transformToInputFile),
  output: {
    format: "esm",
    entryFileNames(chunkInfo) {
      return PluginHelper.cleanInputFile(chunkInfo.facadeModuleId).extension.set("[hash].js")
        .importPath;
    },
    chunkFileNames: "assets/[name].[hash].js",
    assetFileNames: "assets/[name].[hash].[ext]",
    sourcemap: isBuild
  },
  plugins: resolvePlugins()
});

export const bundle = async (pages: Path<any>[]) => {
  const { appConfig, isBuild } = config.getConfigs("appConfig", "isBuild");
  const rollupOptions = resolveOptions(pages, isBuild);
  const bundle = await rollup(rollupOptions);
  const outputOptions = Array.isArray(rollupOptions.output)
    ? rollupOptions.output
    : [rollupOptions.output];

  rimraf.sync(appConfig.build.dir);
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

      const filePath = Path.from(chunk.fileName, appConfig.build.dir);
      filePath.source.saveFile(source);
    }
  }
};
