import { rollup, RollupOptions } from "rollup";
import { Path, resolvePlugins, worker } from "@naxt/runtime";

export const parse = async (pages: Path<any>[]) => {
  const rollupOptions: RollupOptions = {
    input: pages.map(worker.transformToInputFile),
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
