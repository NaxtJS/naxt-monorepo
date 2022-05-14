import { Query } from "@naxt/types";
import { Path } from ".";

export class Extension {
  constructor(private path: Path<Query>) {}

  static from(path: Path<Query>) {
    return new Extension(path);
  }

  isSame(extension: string): boolean {
    return false;
  }

  isSameToOneOf(extensions: string[]): boolean {
    return false;
  }

  setExt(extension: string) {
    this.path.path = this.path.path.replace(
      new RegExp(`${extname(this.path.path)}$`),
      extension.startsWith(".") ? extension : `.${extension}`
    );

    return this.path;
  }

  toString() {
    return extname(this.path.fullPath).slice(1);
  }
}
