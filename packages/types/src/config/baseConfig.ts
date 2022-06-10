import { AppConfig } from "./appConfig";
import { Path, StringBuilder } from "@naxt/utils";
import { ModuleGraph } from "../core";

export interface BaseConfig {
  appConfig: AppConfig;
  appRoot: Path;
  nodeModules: Path;

  license: StringBuilder;

  /* Flags */
  isBuild: boolean;

  moduleGraph: ModuleGraph;
}
