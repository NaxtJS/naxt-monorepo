import type { Plugin } from "@naxt/types";
import { ENTRYPOINT_BASENAME, PluginHelper, StringBuilder, generateHtml } from "@naxt/runtime";
import { NULL_CHAR } from "..";
import MagicString from "magic-string";

// ToDo: move to types package
interface NaxtPostProcessingOptions {
  isBuild: boolean;
}

export const naxtPostProcessing = ({ isBuild }: NaxtPostProcessingOptions): Plugin => {
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
        const html = generateHtml(chunk.fileName, chunk.getMetadata(entryPoint), isBuild);

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
