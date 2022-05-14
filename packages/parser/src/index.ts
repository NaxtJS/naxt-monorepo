import { rollup, RollupOptions } from "rollup";
import { Path } from "@naxt/utils";

import { resolvePlugins } from "@naxt/plugins";

export const parse = async (pages: Path<any>[]) => {
  const rollupOptions: RollupOptions = {
    input: pages.map(page => page.setQueryParam("entrypoint", true).fullPath),
    output: {
      format: "esm",
      generatedCode: "es5"
    },
    plugins: resolvePlugins()
  };

  return {
    bundle: await rollup(rollupOptions),
    outputOptions: Array.isArray(rollupOptions.output)
      ? rollupOptions.output
      : [rollupOptions.output]
  };
};
