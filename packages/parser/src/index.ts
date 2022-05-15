import { rollup, RollupOptions } from "rollup";
import { NULL_CHAR, Path, resolvePlugins } from "@naxt/runtime";

export const parse = async (pages: Path<any>[]) => {
  const rollupOptions: RollupOptions = {
    input: pages.map(page => page.fullPath),
    output: { format: "module" },
    plugins: resolvePlugins()
  };

  return {
    bundle: await rollup(rollupOptions),
    outputOptions: Array.isArray(rollupOptions.output)
      ? rollupOptions.output
      : [rollupOptions.output]
  };
};
