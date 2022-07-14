import {
  config,
  DevServer,
  Path,
  ProdServer,
  resolveConfig,
  Server,
  StringBuilder,
  Watcher,
  WsServer
} from "@naxt/runtime";
import type { NaxtConfig, Parser } from "@naxt/types";
import { ModuleGraph } from "./moduleGraph";

export class Naxt {
  constructor(private naxtConfig: NaxtConfig) {
    config.setConfig("port", naxtConfig.port || 3000);
    config.setConfig("isDev", naxtConfig.isDev || true);
    config.setConfig("isProd", naxtConfig.isProd || false);

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
    const { bundle } = (await import(require.resolve(parserModule))) as Parser;
    await bundle();
  }

  async serve() {
    config.setConfig("appConfig", await resolveConfig());
    const isProd = config.getConfig("isProd");

    const server = new Server();
    const runtimeServer = isProd ? new ProdServer(server) : new DevServer(server);
    const wsServer = new WsServer(server);
    const appRoot = config.getConfig("appRoot");
    const watcher = new Watcher();

    wsServer.emit("start", "welcome");

    await runtimeServer.handle();
    server.start();
  }
}
