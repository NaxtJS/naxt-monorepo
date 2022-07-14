import { Server } from "./server";
import { Parser } from "@naxt/types";
import { config, getPages } from "@naxt/runtime";
import { Logger } from "@naxt/core/src/core/logger";

export class ProdServer {
  private readonly logger = new Logger("Servers.Prod     ");

  constructor(private server: Server<any>) {}

  async handle() {
    this.logger.info("Starting production server");
    const appConfig = config.getConfig("appConfig");
    let { parser: parserModule } = appConfig;
    parserModule === "rollup" && (parserModule = "@naxt/parser-rollup");
    const { bundle } = (await import(require.resolve(parserModule))) as Parser;
    const pages = getPages({ path: true });
    this.logger.info(`Bundling ${pages.length} pages`);
    await bundle(pages, appConfig.cache.dir);
    this.logger.info("Bundling complete");
  }
}
