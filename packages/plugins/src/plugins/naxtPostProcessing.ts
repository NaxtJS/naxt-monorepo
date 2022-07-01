import type { Plugin } from "@naxt/types";
import { ENTRYPOINT_BASENAME, PluginHelper, StringBuilder } from "@naxt/runtime";
import { NULL_CHAR } from "..";
import MagicString from "magic-string";
import { generateHtml } from "@naxt/utils";

export const naxtPostProcessing = (): Plugin => {
  const licenseRegex = /\/\*\*\n\s*\*\s*@license[\s\S]*?\*\//g;
  const license = new StringBuilder();

  return {
    name: "naxt-post-processing-plugin",

    transform(code) {
      const msCode = new MagicString(code);
      let found = false;
      for (const [m] of code.matchAll(licenseRegex)) {
        msCode.replace(licenseRegex, "");
        license.append(m);
        found = true;
      }
      if (found) return { code: msCode.toString(), map: msCode.generateMap({ hires: true }) };
    },

    renderChunk(code, chunk) {
      if (chunk.facadeModuleId?.startsWith(NULL_CHAR + ENTRYPOINT_BASENAME)) {
        const entryPoint = chunk.getEntrypoint();
        const page = PluginHelper.cleanInputFile(entryPoint);
        const html = generateHtml(chunk.fileName, chunk.getMetadata(entryPoint));

        this.emitFile({
          type: "asset",
          fileName: page.duplicateTo("", false).extension.set("html").importPath,
          source: html
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
