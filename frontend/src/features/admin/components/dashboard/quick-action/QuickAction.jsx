import { Link } from "react-router-dom";
import styles from "./QuickAction.module.css";

// eslint-disable-next-line no-unused-vars
const QuickAction = ({ label, to, icon: Icon }) => {
  return (
    <Link to={to} className={styles.card}>
      <Icon className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </Link>
  );
};

export default QuickAction;