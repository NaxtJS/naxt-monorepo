import type { RootConfig } from "@naxt/types";

export class Config<T extends Record<string, any>> implements RootConfig<T> {
  private readonly config: T = {} as T;

  constructor(private initConfig: T = {} as T) {
    this.config = initConfig;
  }

  setConfig<K extends keyof T>(key: K, value: T[K]): this {
    this.config[key] = value;
    return this;
  }

  getConfig<K extends keyof T>(key: K): T[K] {
    return this.config[key];
  }

  getConfigs<K extends keyof T>(...keys: K[]): Pick<T, K> {
    return keys.reduce((acc, key) => {
      acc[key] = this.config[key];
      return acc;
    }, {} as T);
  }
}
