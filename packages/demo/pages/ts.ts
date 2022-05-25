import { useCalculation } from "../hooks/useCalculation";

export default () => {
  const string: string = "Hello World";
  console.log(string);
  console.log(useCalculation(1, 2));
};
