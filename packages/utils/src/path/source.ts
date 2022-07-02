import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "fs";

import type { Query } from "@naxt/types";
import { Path } from ".";

export class Source<Q extends Query> {
  constructor(private path: Path<Q>) {}

  static from<Q extends Query>(path: Path<Q>) {
    return new Source<Q>(path);
  }

  read(format: BufferEncoding = "utf-8") {
    const path = this.path.fullPath;
    if (!this.path.exists) {
      // ToDo: Handle Error
      throw new Error(``);
    }

    return readFileSync(path, format);
  }

  readAsJSON() {
    const content = this.read();
    return JSON.parse(content) as Record<string, unknown>;
  }

  readAsBase64() {
    return this.read("base64");
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
