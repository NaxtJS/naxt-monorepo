import { useCalculation } from "../hooks/useCalculation";
// @ts-ignore
import image from "../assets/index.jpg";

export default () => {
  const string: string = "Hello World";
  console.log(string);
  console.log(useCalculation(1, 2));

  console.log(image);
};
