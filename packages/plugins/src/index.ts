import { Plugin } from "rollup";
import { worker } from "./workerPlugin";
import { typescript } from "./plugins/typescript";

export const resolvePlugins = (): Plugin[] => {
  return [typescript(), worker(), worker.post()];
};
