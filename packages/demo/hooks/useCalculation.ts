import { add } from "lodash";
import pkg from "../package.json";

export const useCalculation = (a: number, b: number) => {
  console.log(pkg);
  return add(a, b);
};
