import { basename, dirname, isAbsolute, resolve } from "path";
import { existsSync, statSync } from "fs";

import { config } from "@naxt/runtime";
import { Query } from "@naxt/types";

import { Extension } from "./extension";
import { Source } from "./source";

export class Path<Q extends Query> {
  private readonly _query: Q;

  constructor(path: string, root: Path<Q> | string = config.getConfig("appRoot"), query = {} as Q) {
    root = (root instanceof Path ? root.fullPath : root) || "";

    if (isAbsolute(path)) {
      if (path.startsWith(root)) {
        this._path = path.replace(new RegExp(`^${root}`, "g"), "");
        this._root = root;
      } else {
        this._path = basename(path);
        this._root = dirname(path);
      }
    } else {
      this._path = path;
      this._root = root;
    }

    this._query = query;
  }

  private _root: string;

  get root() {
    return this._root;
  }

  private _path: string;

  get path() {
    return this._path;
  }

  set path(path: string) {
    if (isAbsolute(path)) {
      this._path = basename(path);
      this._root = dirname(path);
    } else {
      this._path = basename(path);
      this._root = resolve(this.root, dirname(path));
    }
  }

  get query(): Q {
    return this._query;
  }

  get fullPath() {
    return resolve(this._root, this._path);
  }

  get pathWithQuery() {
    return this.fullPath;
  }

  get isFile() {
    return statSync(this.fullPath).isFile();
  }

  get isDirectory() {
    return statSync(this.fullPath).isDirectory();
  }

  get dirname() {
    return this;
  }

  get extension() {
    return Extension.from(this);
  }

  get source() {
    return Source.from(this);
  }

  get exists() {
    return existsSync(this.fullPath);
  }

  static from<Q extends Query>(path: string, root: Path<Q> | string = config.getConfig("appRoot")) {
    return new Path<Q>(path, root);
  }

  duplicateTo(path = "") {
    return Path.from(path ? path : this.path, path ? this : this.root);
  }
}
