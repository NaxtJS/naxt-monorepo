import { AppConfig } from "./appConfig";
import { Path, StringBuilder } from "@naxt/utils";

export interface BaseConfig {
  appConfig: AppConfig;
  appRoot: Path;
  nodeModules: Path;

  license: StringBuilder;

  /* Flags */
  isBuild: boolean;
}
