import _ from "lodash";

import { config, defaultAppConfig } from "@naxt/runtime";
import { AppConfig } from "@naxt/types";

import { Path } from "./path";

export const resolveConfig = async (): Promise<AppConfig> => {
  const defAppConfig = defaultAppConfig();
  let conf: AppConfig;
  const root = config.getConfig("appRoot");
  const path = root.duplicateTo("naxt.config");
  const filePath = path.source.findFile(["ts", "js"]);
  if (filePath?.exists) {
    conf = await import(filePath.fullPath).then(config => config.default || config);
  }

  conf = _.merge(defAppConfig, conf);

  conf.cache.dir = Path.from(conf.cache.dir, root).fullPath;
  conf.build.dir = Path.from(conf.build.dir, root).fullPath;

  return conf;
};
