import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "fs";

import { Query } from "@naxt/types";
import { Path } from ".";

export class Source<Q extends Query> {
  constructor(private path: Path<Q>) {}

  static from<Q extends Query>(path: Path<Q>) {
    return new Source<Q>(path);
  }

  // ToDo: Handle arguments
  read(path = this.path.fullPath) {
    if (!this.path.exists) {
      // ToDo: Handle Error
      throw new Error(``);
    }

    return readFileSync(path, "utf-8");
  }

  listFiles(path = this.path.fullPath) {
    return readdirSync(path);
  }

  mkdir(path = this.path.fullPath) {
    mkdirSync(path, { recursive: true });
  }

  saveFile(source: string) {
    this.mkdir(this.path.dirname.fullPath);
    writeFileSync(this.path.fullPath, source);
  }

  readAsJSON<T extends Record<string, any>>(): T {
    const content = this.read();
    return JSON.parse(content) as T;
  }

  findFile(extensions: string[] = []): Path<Q> {
    const files = this.listFiles(this.path.root);

    if (extensions.length) {
      this.path.path = files.find(
        file =>
          file.startsWith(this.path.path) && extensions.some(extension => file.endsWith(extension))
      );
    } else {
      this.path.path = files.find(file => file.startsWith(this.path.path));
    }

    return this.path;
  }
}
