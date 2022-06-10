import { basename, dirname, resolve, sep } from "path";
import { copyFileSync, existsSync, statSync } from "fs";

import { config } from "@naxt/runtime";
import { Query } from "@naxt/types";

import { Extension } from "./extension";
import { Source } from "./source";

export class Path<Q extends Query = Query> {
  constructor(path: string, root: Path | string = config.getConfig("appRoot"), query = {} as Q) {
    this.define(path, root, query);
  }

  private _query = {} as Q;

  get query(): Q {
    return this._query;
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
    this.define(path, this.root, this.query);
  }

  get basename() {
    const regexString = this.extension.toString();
    const regex = new RegExp(`${regexString}$`);
    return this._path.replace(regex, "").slice(0, -1);
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
    root: Path | string = config.getConfig("appRoot"),
    query = {} as Q
  ) {
    return new Path(path, root, query);
  }

  duplicateTo(path = "") {
    return Path.from(path ? path : this.path, path ? this : this.root);
  }

  relativeTo(path: string) {
    const { path: _path, root, query } = this.parse(path, this.dirname, this.query);
    return Path.from(_path, root, query);
  }

  copyTo(destination: string | Path) {
    const destinationPath = Path.from(
      typeof destination === "string" ? destination : destination.fullPath
    );

    destinationPath.dirname.source.mkdir();
    copyFileSync(this.fullPath, destinationPath.fullPath);
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

  private parse(path: string, root: Path | string, query: Q) {
    if (!path) return;

    root = (root instanceof Path ? root.fullPath : root) || "";
    let queryString: string;
    [path, queryString] = path.includes("?") ? path.split("?") : [path, ""];
    const fullPath = resolve(root, path);
    [root, path] = [dirname(fullPath), basename(fullPath)];

    const oldQuery = Object.assign({}, this.query);
    this._query = {} as Q;
    Object.entries(query).forEach(([qk, qv]: [any, any]) => this.setQueryParam(qk, qv));
    if (queryString) {
      queryString.split("&").forEach(a => {
        const [key, ...values] = a.split("=");
        this.setQueryParam(key as keyof Q, values.join("=") as Q[typeof key]);
      });
    }
    query = Object.assign({}, this.query);
    this._query = oldQuery;

    return { root, path, query };
  }

  private define(path: string, root: Path | string, query: Q) {
    const { root: _root, path: _path, query: _query } = this.parse(path, root, query);
    [this._root, this._path, this._query] = [_root, _path, _query];
  }
}
