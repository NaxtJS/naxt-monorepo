import { readFileSync, mkdirSync, writeFileSync } from "fs";
import glob, { IOptions as GlobOptions } from "glob";

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

  listFiles(options?: GlobOptions): string[];
  listFiles(pattern: string, options?: GlobOptions): string[];
  listFiles(pattern: GlobOptions | string, options?: GlobOptions): string[] {
    [pattern, options] = [
      typeof pattern === "string" ? pattern : "**",
      typeof pattern === "string" ? options : pattern
    ];

    let isDirectory = false;
    try {
      isDirectory = this.path.isDirectory;
    } catch (e) {}
    options = options || {};
    options.cwd = isDirectory ? this.path.fullPath : this.path.root;
    return glob.sync(pattern, options || {});
  }

  mkdir(path = this.path.fullPath) {
    mkdirSync(path, { recursive: true });
  }

  saveFile(source: string) {
    this.mkdir(this.path.dirname.fullPath);
    writeFileSync(this.path.fullPath, source);
  }

  findFile(extensions: string[] = []): Path<Q> {
    const files = this.listFiles("*");

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
