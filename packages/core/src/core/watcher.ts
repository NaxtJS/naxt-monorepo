import { watch } from "chokidar";
import { Logger } from "./logger";
import { WatcherCallback, WatcherEvent } from "@naxt/types";
import { Stats } from "fs";
import { debounce } from "@naxt/utils/src/debounce";

export class Watcher {
  private readonly logger = new Logger("Watcher");
  private readonly watcherFilesMap: Record<string, true> = {};
  private watcherEnabled: boolean = false;

  constructor(private watcherCallbacks = {} as Record<WatcherEvent, WatcherCallback>) {
    this.logger.log("Watcher Created...");
  }

  on(event: WatcherEvent, cb: WatcherCallback) {
    this.watcherCallbacks[event] = cb;
    return this;
  }

  addWatchingFile(file: string) {
    if (this.watcherFilesMap[file]) return this;
    this.watchFile(file);
    this.watcherFilesMap[file] = true;

    return this;
  }

  watch() {
    if (this.watcherEnabled) return;
    this.logger.log("Watching Files...");
    this.watcherEnabled = true;
    for (const file of Object.keys(this.watcherFilesMap)) {
      this.watchFile(file);
    }
    this.watcherEnabled = true;
  }

  private watchFile(file: string) {
    const fsWatch = watch(file, { alwaysStat: true });

    for (const [watcherEvent, watcherCb] of Object.entries(this.watcherCallbacks)) {
      fsWatch.on(watcherEvent, (file: string, stats?: Stats) => {
        const debouncedWatcherCb = debounce(watcherCb, 100);
        debouncedWatcherCb.bind({ logger: this.logger, stats })(file);
      });
    }
  }
}
