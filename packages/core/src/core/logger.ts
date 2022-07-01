import { Logger as ILogger, LoggerLevels } from "@naxt/types";
import { inspect } from "util";

type Message = string | boolean | number;

export class Logger implements ILogger {
  public console = Object.assign({}, console);
  private level: LoggerLevels = LoggerLevels.TRACE;
  private timers: Record<string, number> = {};

  /**
   *  Template Variables:
   *  - %name - name
   *  - %level - message level
   *  - %date - current time
   *  - %message - message
   *
   * @param {string} name
   * @param {string} template
   */
  constructor(private name: string, private template = "[%name][%level][%date]: %message") {}

  private static fixMessage(message: Message) {
    return typeof message === "object"
      ? inspect(message, { colors: true, depth: 2 })
      : message.toString();
  }

  setLevel(level: LoggerLevels) {
    this.level = level;
  }

  trace(...message: Message[]) {
    this.print(message, LoggerLevels.TRACE);
  }

  info(...message: Message[]) {
    this.print(message, LoggerLevels.INFO);
  }

  debug(...message: Message[]) {
    this.print(message, LoggerLevels.DEBUG);
  }

  log(...message: Message[]) {
    this.print(message, LoggerLevels.LOG);
  }

  warn(...message: Message[]) {
    this.print(message, LoggerLevels.WARN);
  }

  error(...message: Message[]) {
    this.print(message, LoggerLevels.ERROR);
  }

  time(label: string) {
    this.timers[label] = performance.now();
  }

  timeEnd(label: string) {
    const differenceInMs = performance.now() - this.timers[label];
    this.log(`${label}: ${differenceInMs}ms - timer ended`);
    delete this.timers[label];
  }

  enable() {
    console.trace = this.trace.bind(this);
    console.debug = this.debug.bind(this);
    console.info = this.info.bind(this);
    console.log = this.log.bind(this);
    console.warn = this.warn.bind(this);
    console.error = this.error.bind(this);
    console.time = this.time.bind(this);
    console.timeEnd = this.timeEnd.bind(this);
  }

  disable() {
    console = this.console;
  }

  private print(message: Message[], level: LoggerLevels) {
    const variables = {
      name: this.name,
      level: LoggerLevels[level].toLowerCase(),
      date: new Date().toDateString(),
      message: message.map(Logger.fixMessage).join(" ")
    };

    const template = Object.entries(variables).reduce(
      (acc, [variable, value]) => acc.replace(`%${variable}`, value),
      this.template
    );

    level >= this.level && this.console.log(template);
  }
}
