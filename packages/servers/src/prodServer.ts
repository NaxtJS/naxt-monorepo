import { Server } from "./server";
import { Parser } from "@naxt/types";
import { config } from "@naxt/runtime";
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
    this.logger.info(`Bundling pages`);
    await bundle(appConfig.cache.dir);
    this.logger.info("Bundling complete");
  }
}
