import type { AppConfig } from "@naxt/types";
import { PartialDeep } from "type-fest";

export const defineConfig = (config: PartialDeep<AppConfig>) => config;

export { Naxt } from "./core/naxt";
export { Config } from "./core/config";
export { Logger } from "./core/logger";
export { Watcher } from "./core/watcher";
export { ModuleGraph } from "./core/moduleGraph";
export { defaultAppConfig } from "./const/defaultAppConfig";
