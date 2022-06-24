import { extname } from "path";

import { Query } from "@naxt/types";
import { Path } from ".";

export class Extension {
  constructor(private path: Path<Query>) {}

  static from(path: Path<Query>) {
    return new Extension(path);
  }

  isSameTo(extension: string): boolean {
    return extname(this.path.fullPath) && this.path.fullPath.endsWith(extension);
  }

  isSameToOneOf(extensions: string[]): boolean {
    return extensions.some(extension => this.isSameTo(extension));
  }

  set(extension?: string) {
    this.path.path = this.path.path.replace(
      new RegExp(`${extname(this.path.path)}$`),
      extension ? (extension.startsWith(".") ? extension : `.${extension}`) : ""
    );

    return this.path;
  }

  toString() {
    return extname(this.path.fullPath).slice(1);
  }
}
