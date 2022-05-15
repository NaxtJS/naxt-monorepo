import { config, Path } from "@naxt/runtime";
import { generateHash, StringBuilder } from "@naxt/utils";
import { OutputOptions, RollupBuild } from "rollup";
import rimraf from "rimraf";

export const generate = async (bundle: RollupBuild, outputOptions: OutputOptions[]) => {
  const appConfig = config.getConfig("appConfig");
  rimraf.sync(config.getConfig("appConfig").build.dir);

  for (const outputOption of outputOptions) {
    const { output } = await bundle.generate(outputOption);

    for (let chunk of output) {
      const isEntry = chunk.type === "chunk" && chunk.isEntry;
      const source =
        chunk.type === "chunk"
          ? chunk.code
          : chunk.type === "asset"
          ? typeof chunk.source === "string"
            ? chunk.source
            : new TextDecoder("utf-8").decode(chunk.source)
          : "";
      const hash = generateHash(source);
      const fileExtension = Path.from(chunk.fileName).extension.toString();
      const fileName = chunk.name?.replace(/^_|_$/g, "") || "";

      const filename = isEntry ? `${fileName}.${hash}.${fileExtension}` : chunk.fileName;
      const assetName = `assets/${filename}`;
      const path = Path.from(assetName, appConfig.build.dir);
      path.source.saveFile(source);

      if (isEntry) {
        const html = new StringBuilder()
          .append(`<!DOCTYPE html>`)
          .append(`<html lang="en">`)
          .append(`  <head>`)
          // ToDo: get title from page.
          .append(`    <title></title>`)
          // .appendGroup(cssAsset => `    <link rel="stylesheet" href="/${cssAsset}" />`, cssAssets)
          .append(`  </head>`)
          .append()
          .append(`  <body>`)
          .append(`    <div id="#app">`)
          // .append(`      ${htmlContent}`, !!htmlContent)
          .append(`    </div>`)
          .append()
          .append(`    <script type="module" src="/${assetName}"></script>`, !!assetName)
          .append(`  </body>`)
          .append(`</html>`)
          .build();

        Path.from(chunk.fileName, appConfig.build.dir)
          .extension.setExt("html")
          .source.saveFile(html);
      }
    }
  }
};
