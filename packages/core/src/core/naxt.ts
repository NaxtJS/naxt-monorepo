import { config, getPages, Path, resolveConfig, StringBuilder } from "@naxt/runtime";
import type { NaxtConfig, Parser, ServeOptions } from "@naxt/types";
import { ModuleGraph } from "./moduleGraph";

export class Naxt {
  constructor(private naxtConfig: NaxtConfig) {
    config.setConfig("appRoot", Path.from(process.cwd()));
    config.setConfig("license", new StringBuilder());
    config.setConfig("moduleGraph", new ModuleGraph());

    try {
      config.setConfig("nodeModules", Path.from(require.resolve("express")).dirname.dirname);
    } catch (e) {
      config.setConfig("nodeModules", Path.from("node_modules", process.cwd()));
    }
  }

  async build() {
    config.setConfig("appConfig", await resolveConfig());
    config.setConfig("isBuild", true);
    let { parser: parserModule } = config.getConfig("appConfig");
    parserModule === "rollup" && (parserModule = "@naxt/parser-rollup");
    const pages = getPages({ path: true, absolute: true });
    const { bundle } = (await import(require.resolve(parserModule))) as Parser;
    await bundle(pages);
  }

  async serve(options?: ServeOptions) {
    config.setConfig("appConfig", await resolveConfig());
  }
}
