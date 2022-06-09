import {
  config,
  getPages,
  NaxtConfig,
  parse,
  generate,
  Path,
  resolveConfig,
  StringBuilder
} from "@naxt/runtime";

export class Naxt {
  constructor(private naxtConfig: NaxtConfig) {
    config.setConfig("appRoot", Path.from(process.cwd()));
    config.setConfig("license", new StringBuilder());

    try {
      config.setConfig("nodeModules", Path.from(require.resolve("express")).dirname.dirname);
    } catch (e) {
      config.setConfig("nodeModules", Path.from("node_modules", process.cwd()));
    }
  }

  async build() {
    config.setConfig("appConfig", await resolveConfig());
    config.setConfig("isBuild", true);
    const pages = getPages({ path: true, absolute: true });
    const { bundle, outputOptions } = await parse(pages);
    await generate(bundle, outputOptions);
  }

  async serve() {
    config.setConfig("appConfig", await resolveConfig());
  }
}
