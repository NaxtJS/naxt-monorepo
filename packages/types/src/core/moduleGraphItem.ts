export interface ModuleGraphItem {
  name: string;
  parents?: Set<string>;
  children?: Set<string>;
}
