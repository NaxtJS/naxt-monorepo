import { add } from "lodash";
import styles from "../assets/style.module.css";
import "../assets/style.css";

export default () => {
  console.log(add(1, 2));
  console.log(styles.graph);
};
