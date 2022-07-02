import type { Path, StringBuilder } from "@naxt/runtime";
import { AppConfig } from "./appConfig";
import { ModuleGraph } from "../core";
import { NaxtConfig } from "./naxtConfig";

export interface BaseConfig extends NaxtConfig {
  appConfig: AppConfig;
  appRoot: Path;
  nodeModules: Path;

  license: StringBuilder;

  /* Flags */
  isBuild: boolean;

  moduleGraph: ModuleGraph;
}
