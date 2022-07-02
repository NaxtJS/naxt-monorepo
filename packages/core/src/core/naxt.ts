import { config, getPages, Path, resolveConfig, StringBuilder } from "@naxt/runtime";
import type { NaxtConfig, Parser, ServeOptions } from "@naxt/types";
import { ModuleGraph } from "./moduleGraph";
import { DevServer, ProdServer, Server } from "@naxt/runtime";

export class Naxt {
  constructor(private naxtConfig: NaxtConfig) {
    config.setConfig("port", naxtConfig.port || 3000);
    config.setConfig("isDev", naxtConfig.isDev || false);

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
    const { isProd = false } = options || {};
    const server = new Server();
    const runtimeServer = isProd ? new ProdServer(server) : new DevServer(server);
    await runtimeServer.handle();
    server.start();
  }
}
