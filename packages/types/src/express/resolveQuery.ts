import { Query } from "./query";

export interface ResolveQuery extends Query {
  entrypoint: boolean;
  importer: string;
}
