import { add } from "lodash";
// @ts-ignore
import styles from "../../assets/style.module.css";

export default () => {
  console.log(add(1, 2));
  console.log(styles.graph);
};
