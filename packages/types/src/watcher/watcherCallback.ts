import { WatcherCallbackThisContext } from "./watcherCallbackThisContext";

export interface WatcherCallback {
  (this: WatcherCallbackThisContext, filename: string): void;
}
