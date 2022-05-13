import { Generic } from "../utils";

export interface RootConfig<T extends Record<string, any>> {
  setConfig<K extends keyof T>(name: K, value: T[K]): void;

  getConfig<K extends keyof T>(name: K): T[K];

  getConfigs<K extends keyof T>(...keys: K[]): Generic<T, K>;
}
