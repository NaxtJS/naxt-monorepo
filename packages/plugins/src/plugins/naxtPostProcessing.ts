import type { Plugin, ChunkMetadata } from "@naxt/runtime";
import { ENTRYPOINT_BASENAME, PluginHelper, StringBuilder } from "@naxt/runtime";
import { NULL_CHAR } from "..";

export const naxtPostProcessing = (): Plugin => {
  const licenseRegex = /\/\*\*\n\s*\*\s*@license[\s\S]*?\*\//;
  const license = new StringBuilder();

  return {
    name: "naxt-post-processing-plugin",

    transform(code) {
      let m;
      while ((m = code.match(licenseRegex))) {
        code = code.replace(licenseRegex, "");
        license.append(m[0]);
      }

      return code;
    },

    renderChunk(code, chunk) {
      if (chunk.facadeModuleId?.startsWith(NULL_CHAR + ENTRYPOINT_BASENAME)) {
        const entryPoint = chunk.getEntrypoint();
        const page = PluginHelper.cleanInputFile(entryPoint);
        const meta: ChunkMetadata = chunk.getMetadata(entryPoint);

        this.emitFile({
          type: "asset",
          fileName: page.duplicateTo("", false).extension.set("html").importPath,
          source: new StringBuilder()
            .append(`<!DOCTYPE html>`)
            .append(`<html lang="en">`)
            .append(`  <head>`)
            // ToDo: get title from page.
            .append(`    <title></title>`)
            .appendGroup(
              cssAsset => `    <link rel="stylesheet" href="/${cssAsset}" />`,
              Array.from(meta.importedCss)
            )
            .appendGroup(
              asset => `    <link rel="preload" href="/${asset}" as="style" />`,
              Array.from(meta.importedAssets)
            )
            .append(`  </head>`)
            .append()
            .append(`  <body>`)
            .append(`    <div id="#app">`)
            // .append(`      ${htmlContent}`, !!htmlContent)
            .append(`    </div>`)
            .append()
            .append(
              `    <script type="module" src="/${chunk.fileName}"></script>`,
              !!chunk.fileName
            )
            .append(`  </body>`)
            .append(`</html>`)
            .build()
        });
      }

      return null;
    },

    generateBundle() {
      license.length &&
        this.emitFile({
          type: "asset",
          fileName: "LICENSE",
          source: license.build()
        });
    }
  };
};
