import { ModuleGraphItem } from "./moduleGraphItem";

export interface ModuleGraph {
  addChild(module: string, childModuleGraphItem: string): void;
  createGraphItem(moduleGraphItem: ModuleGraphItem): void;
  getGraphItem(moduleGraphItem: string): ModuleGraphItem | null;
  getParent(module: string): Set<string>;
  getRootParent(module: string): ModuleGraphItem[];
}
