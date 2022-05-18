import { basename, dirname, isAbsolute, resolve, sep } from "path";
import { existsSync, statSync } from "fs";

import { config } from "@naxt/runtime";
import { Query } from "@naxt/types";

import { Extension } from "./extension";
import { Source } from "./source";

export class Path<Q extends Query = Query> {
  private readonly _query = {} as Q;

  constructor(path: string, root: Path | string = config.getConfig("appRoot"), query = {} as Q) {
    if (!path) return;

    root = (root instanceof Path ? root.fullPath : root) || "";
    let queryString: string;
    [path, queryString] = path.includes("?") ? path.split("?") : [path, ""];

    if (isAbsolute(path)) {
      this._path = basename(path).replace(new RegExp(`^${root}`, "g"), "");
      this._root = dirname(path);
    } else {
      this._path = path;
      this._root = root;
    }

    Object.entries(query).forEach(([qk, qv]: [any, any]) => this.setQueryParam(qk, qv));
    if (queryString) {
      queryString.split("&").forEach(a => {
        const [key, ...values] = a.split("=");
        this.setQueryParam(key as keyof Q, values.join("=") as Q[typeof key]);
      });
    }
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

  get basename() {
    return basename(this._path).replace(this.extension.toString(), "").slice(0, -1);
  }

  get query(): Q {
    return this._query;
  }

  get fullPath() {
    return resolve(this._root, this._path);
  }

  get importPath() {
    return this.fullPath.split(sep).join("/");
  }

  get pathWithQuery() {
    const queryString = Object.entries(this.query)
      .map(items => items.join("="))
      .join("&");
    return this.fullPath + (queryString ? `?${queryString}` : queryString);
  }

  get isFile() {
    return statSync(this.fullPath).isFile();
  }

  get isDirectory() {
    return statSync(this.fullPath).isDirectory();
  }

  get dirname() {
    return Path.from(dirname(this.fullPath));
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

  get normalized() {
    return this.fullPath.replace(/[\\\/]/g, sep);
  }

  static from<Q extends Query = Query>(
    path: string,
    root: Path | string = config.getConfig("appRoot")
  ) {
    return new Path<Q>(path, root);
  }

  duplicateTo(path = "") {
    return Path.from(path ? path : this.path, path ? this : this.root);
  }

  setQueryParam<K extends keyof Q>(key: K, value: Q[K]) {
    if (value !== undefined) {
      this.query[key] = value;
    }
    return this;
  }

  getQueryParam<K extends keyof Q>(key: K): Q[K] {
    const value = this.query[key];

    return !value
      ? value
      : (["true", "false"] as Q[K][]).includes(value)
      ? ((value === "true") as Q[K])
      : value.toString().match(/^\d+$/)
      ? (parseInt(String(value)) as Q[K])
      : value;
  }
}
