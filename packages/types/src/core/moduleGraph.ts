import { ModuleGraphItem } from "./moduleGraphItem";

export interface ModuleGraph {
  addChild(module: string, childModuleGraphItem: string): void;
  createGraphItem(moduleGraphItem: ModuleGraphItem): void;
  getGraphItem(moduleGraphItem: string): ModuleGraphItem | null;
  getParent(module: string): string[];
  getRootParent(module: string): Set<string>;
}
