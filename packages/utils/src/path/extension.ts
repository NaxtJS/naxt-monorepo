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
}
