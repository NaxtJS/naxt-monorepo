import { config, Plugin, PolyfillOptions } from "@naxt/runtime";
import { MODULE_POLYFILL_ID } from "../..";
import { polyfill, polyfillPluginLicense } from "./polyfill";

/**
 * ToDo: WIP: Will be implemented in future
 */
export const polyfillPlugin = (): Plugin => {
  const { appConfig, isBuild } = config.getConfigs("appConfig", "isBuild");
  const polyfillOptions = appConfig.build.polyfill;
  const isSSR = appConfig.build.isSSR;
  const skip = !polyfillOptions || (!isBuild && isSSR);
  let polyfillString: string | undefined;

  return {
    name: "naxt-polyfill-plugin",

    resolveId(id) {
      if (id === MODULE_POLYFILL_ID) {
        return id;
      }
    },

    load(id) {
      if (id === MODULE_POLYFILL_ID) {
        if (skip) return "";
        if (!polyfillString) {
          polyfillString = `${polyfillPluginLicense}${
            /*isModernFlag*/ false
          }&&${polyfill.toString()}();`;
        }
        return polyfillString;
      }
    }
  };
};
