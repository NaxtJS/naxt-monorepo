import type { Plugin } from "@naxt/types";

/**
 * ToDO: WIP: Will be implemented in future
 * @link https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/preAlias.ts
 */
export function preAlias(): Plugin {
  return {
    name: "naxt-pre-alias-plugin",

    async resolveId(id, importer, options) {
      // const ssr = options?.ssr ?? false;
      // const depsOptimizer = getDepsOptimizer(config);
      // if (depsOptimizer && bareImportRE.test(id) && !options?.scan) {
      //   return await tryOptimizedResolve(depsOptimizer, ssr, id, importer);
      // }
    }
  };
}
