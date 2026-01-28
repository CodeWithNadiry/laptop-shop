import { Link } from "react-router-dom";
import styles from "./StatCard.module.css";

const StatCard = ({ title, value, to }) => {
  return (
    <Link to={to} className={styles.card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </Link>
  );
};

export default StatCard;