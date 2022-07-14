import type { Path, StringBuilder } from "@naxt/runtime";
import { AppConfig } from "./appConfig";
import { ModuleGraph } from "../core";
import { NaxtConfig } from "./naxtConfig";
import { Watcher } from "@naxt/runtime";

export interface BaseConfig extends NaxtConfig {
  appConfig: AppConfig;
  appRoot: Path;
  nodeModules: Path;

  /* Objects */
  moduleGraph: ModuleGraph;
  watcher: Watcher;
  license: StringBuilder;

  /* Flags */
  isBuild: boolean;
}
