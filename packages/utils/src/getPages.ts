import { glob } from "glob";
import { config, Path } from "@naxt/runtime";
import { GetPagesOptions } from "@naxt/types";

export function getPages(options: GetPagesOptions<true>): Path<any>[];
export function getPages(options?: GetPagesOptions<false>): string[];
export function getPages(options: GetPagesOptions<boolean> = {}): (Path<any> | string)[] {
  const { appRoot } = config.getConfigs("appRoot");
  const pagesRoot = appRoot.duplicateTo("pages");

  return glob
    .sync("**", {
      cwd: pagesRoot.fullPath,
      nodir: true,
      absolute: options.absolute || false
    })
    .map(path => (options.path ? Path.from(path, pagesRoot) : path));
}
