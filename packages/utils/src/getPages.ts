import { glob } from "glob";
import { config, Path } from "@naxt/runtime";
import type { GetPagesOptions, Query } from "@naxt/types";

export function getPages<T extends Query = Query>(options: GetPagesOptions<true>): Path<T>[];
export function getPages<T extends Query = Query>(options?: GetPagesOptions<false>): string[];
export function getPages<T extends Query = Query>(
  options: GetPagesOptions<boolean> = {}
): (Path<T> | string)[] {
  const appRoot = config.getConfig("appRoot");
  const pagesRoot = appRoot.duplicateTo("pages");

  return glob
    .sync("**", { cwd: pagesRoot.fullPath, nodir: true })
    .map(path =>
      options.path
        ? Path.from(path, pagesRoot, {} as T, false)
        : options.absolute
        ? Path.from(path, pagesRoot).fullPath
        : path
    );
}
