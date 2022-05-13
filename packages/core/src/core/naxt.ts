import { NaxtConfig } from "@naxt/types";
import { config, resolveConfig } from "@naxt/runtime";
import { Path } from "@naxt/utils";

export class Naxt {
  constructor(private naxtConfig: NaxtConfig) {
    config.setConfig("appRoot", Path.from(process.cwd()));

    try {
      config.setConfig("nodeModules", Path.from(require.resolve("express")).dirname.dirname);
    } catch (e) {
      config.setConfig("nodeModules", Path.from("node_modules", process.cwd()));
    }
  }

  async build() {
    config.setConfig("appConfig", await resolveConfig());

    console.log(config.getConfig("appConfig"));
  }

  async serve() {
    config.setConfig("appConfig", await resolveConfig());
  }
}
