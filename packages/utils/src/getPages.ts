import { glob } from "glob";
import { config, Path } from "@naxt/runtime";
import { GetPagesOptions, Query } from "@naxt/types";

export function getPages<T extends Query = Query>(options: GetPagesOptions<true>): Path<T>[];
export function getPages(options?: GetPagesOptions<false>): string[];
export function getPages<T extends Query = Query>(
  options: GetPagesOptions<boolean> = {}
): (Path<T> | string)[] {
  const appRoot = config.getConfig("appRoot");
  const pagesRoot = appRoot.duplicateTo("pages");

  return glob
    .sync("**", {
      cwd: pagesRoot.fullPath,
      nodir: true,
      absolute: options.absolute || false
    })
    .map(path => (options.path ? Path.from(path, pagesRoot) : path));
}
