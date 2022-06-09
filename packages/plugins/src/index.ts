import { Plugin } from "rollup";
import { worker } from "./workerPlugin";
import { typescript } from "./plugins/typescript";

export const resolvePlugins = (): Plugin[] => {
  return [typescript(), worker(), worker.post()];
};

export const ENTRYPOINT_BASENAME = "naxt:entry";
export const NULL_CHAR = String.fromCharCode(0x00);
