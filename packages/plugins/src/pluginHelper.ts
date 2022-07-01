import { ENTRYPOINT_BASENAME, NULL_CHAR } from ".";
import { config, Path } from "@naxt/runtime";

export class PluginHelper {
  static transformToInputFile(file: string | Path) {
    return `${NULL_CHAR}${ENTRYPOINT_BASENAME}?page=${file instanceof Path ? file.fullPath : file}`;
  }

  static cleanInputFile(input: string): Path | null {
    if (
      input.startsWith(NULL_CHAR + ENTRYPOINT_BASENAME) ||
      input.startsWith(ENTRYPOINT_BASENAME)
    ) {
      const appRoot = config.getConfig("appRoot");
      const path = Path.from<{ page: string }>(input);
      return Path.from(path.query.page).assignRoot(appRoot.duplicateTo("pages"));
    }

    return null;
  }
}
