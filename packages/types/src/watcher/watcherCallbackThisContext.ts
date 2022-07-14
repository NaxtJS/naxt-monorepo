import { Logger } from "../logger";
import { Stats } from "fs";

export interface WatcherCallbackThisContext {
  logger: Logger;
  stats: Stats;
}
