export interface Logger {
  console: typeof console;

  trace(...message: string[]): void;

  info(...message: string[]): void;

  debug(...message: string[]): void;

  log(...message: string[]): void;

  warn(...message: string[]): void;

  error(...message: string[]): void;

  time(label: string): void;

  timeEnd(label: string): void;

  enable(): void;

  disable(): void;
}
