import type { ChunkMetadata } from "@naxt/types";
import { StringBuilder } from "./builders";

export const generateHtml = (filename: string, meta: ChunkMetadata, isBuild: boolean) => {
  const time = isBuild ? `` : `?${Date.now()}`;

  return (
    new StringBuilder()
      .append(`<!DOCTYPE html>`)
      .append(`<html lang="en">`)
      .append(`  <head>`)
      // ToDo: get title from page.
      .append(`    <title></title>`)
      .appendGroup(
        cssAsset => `    <link rel="stylesheet" href="/${cssAsset}" />`,
        meta.importedCss
      )
      .appendGroup(
        ([asset, chunk]) => `    <link rel="preload" href="/${asset}" as="${chunk.type}" />`,
        Object.entries(meta.importedAssets)
      )
      .append(`  </head>`)
      .append()
      .append(`  <body>`)
      .append(`    <div id="#app">`)
      // .append(`      ${htmlContent}`, !!htmlContent)
      .append(`    </div>`)
      .append()
      .append(`    <script type="module" src="/${filename}${time}"></script>`, !!filename)
      .append(`  </body>`)
      .append(`</html>`)
      .build()
  );
};
