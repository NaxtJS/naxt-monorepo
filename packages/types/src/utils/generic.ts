export type Generic<T extends Record<K, any>, K extends keyof T> = { [A in K]: T[A] };
