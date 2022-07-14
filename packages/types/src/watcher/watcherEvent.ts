export type WatcherEvent =
  | "add"
  | "addDir"
  | "change"
  | "unlink"
  | "unlinkDir"
  | "all"
  | "error"
  | "raw"
  | "ready";
