import type { ModuleGraphItem, ModuleGraph as ModuleGraphType } from "@naxt/types";

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
    return Array.from(this.moduleGraphItems[module].parents);
  }

  getRootParent(module: string) {
    const rootParentModules = new Set<string>();
    const willBeIteratedModules = new Set<string>();

    willBeIteratedModules.add(module);
    while (true) {
      willBeIteratedModules.forEach(module => {
        const parentModules = this.getParent(module);
        if (parentModules.length === 0) {
          rootParentModules.add(module);
        } else {
          parentModules.forEach(parentModule => {
            willBeIteratedModules.add(parentModule);
          });
        }
        willBeIteratedModules.delete(module);
      });

      if (willBeIteratedModules.size === 0) break;
    }

    return rootParentModules;
  }
}
