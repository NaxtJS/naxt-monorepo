import { AppConfig } from "./appConfig";
import { Path } from "@naxt/utils";

export interface BaseConfig {
  appConfig: AppConfig;
  appRoot: Path;
  nodeModules: Path;
}
