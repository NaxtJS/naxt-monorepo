import { AppConfig } from "@naxt/types";
import { config } from "@naxt/runtime";
import { PackageJson } from "type-fest";

export const defaultAppConfig = (): AppConfig => {
  const pkg = config
    .getConfig("appRoot")
    .duplicateTo("package.json")
    .source.readAsJSON<PackageJson>();

  return {
    cache: { dir: config.getConfig("nodeModules").duplicateTo(".naxt").path },
    build: { dir: config.getConfig("appRoot").duplicateTo("build").path },
    head: {
      meta: { charset: "UTF-8", description: pkg.description },
      scripts: [],
      styles: [],
      title: pkg.name
    },
    aliases: {
      __CONTAINER__: 'document.getElementById("#app")'
    }
  };
};
