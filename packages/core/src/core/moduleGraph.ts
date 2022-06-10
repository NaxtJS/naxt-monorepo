import { ModuleGraphItem, ModuleGraphType } from "@naxt/runtime";

export class ModuleGraph implements ModuleGraphType {
  private readonly moduleGraphItems: Record<string, ModuleGraphItem> = {};

  addChild(module: string, child: string) {
    const childGraph = this.getGraphItem(child);
    if (!childGraph) {
      throw new Error(`Module with name "${child}" not found...`);
    }

    childGraph.parents.add(module);
    this.getGraphItem(module).children.add(childGraph.name);
  }

  createGraphItem(moduleGraphItem: ModuleGraphItem) {
    this.moduleGraphItems[moduleGraphItem.name] = moduleGraphItem;
    moduleGraphItem.parents = moduleGraphItem.parents || new Set();
    moduleGraphItem.children = moduleGraphItem.children || new Set();
  }

  getGraphItem(module: string) {
    return this.moduleGraphItems[module] || null;
  }

  getParent(module: string) {
    return this.moduleGraphItems[module].parents;
  }

  getRootParent(module: string) {
    const parents = new Set<string>();

    const graphItem = this.getGraphItem(module);
    console.log(graphItem);

    return Array.from(parents).map(parent => this.getGraphItem(parent));
  }
}
