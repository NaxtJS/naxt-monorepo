import { Server } from "./server";
import { config, Logger, Path } from "@naxt/runtime";
import { Parser } from "@naxt/types";
import { resolve } from "path";

export class DevServer {
  private readonly logger = new Logger("Servers.Dev      ");

  constructor(private server: Server<any>) {}

  async handle() {
    this.logger.info("Starting dev server...");
    const appConfig = config.getConfig("appConfig");
    let { parser: parserModule } = appConfig;
    parserModule === "rollup" && (parserModule = "@naxt/parser-rollup");
    const { bundle } = (await import(require.resolve(parserModule))) as Parser;
    this.logger.info("Bundling pages...");
    await bundle(appConfig.cache.dir);
    this.logger.info("Bundling pages...done");

    Path.from(appConfig.cache.dir)
      .source.listFiles({ nodir: true })
      .forEach(file => {
        const endpointFile = file.replace(/.html$/, "").replace(/\/?index$/, "");
        this.server.endpoint(`/${endpointFile}`, (req, res) => {
          res.sendFile(resolve(appConfig.cache.dir, file));
        });
      });
  }
}
