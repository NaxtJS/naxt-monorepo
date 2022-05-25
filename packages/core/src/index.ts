import { AppConfig } from "@naxt/types";
import { PartialDeep } from "type-fest";

export const defineConfig = (config: PartialDeep<AppConfig>) => config;

export { Naxt } from "./core/naxt";
export { Config } from "./core/config";
export { defaultAppConfig } from "./const/defaultAppConfig";
