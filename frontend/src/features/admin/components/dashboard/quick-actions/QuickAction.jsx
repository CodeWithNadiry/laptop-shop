import {
  FiPlus,
  FiBox,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import styles from "./QuickActions.module.css";
import QuickAction from "../quick-action/QuickAction";

const QuickActions = () => {
  // Define all actions in an array
  const actions = [
    { label: "Add Product", to: "products/add", icon: FiPlus },
    { label: "Manage Products", to: "products", icon: FiBox },
    { label: "View Orders", to: "orders", icon: FiShoppingCart },
    { label: "Manage Users", to: "users", icon: FiUsers },
  ];

  return (
    <section className={styles.actions}>
      <h2 className={styles.title}>Quick Actions</h2>

      <div className={styles.grid}>
        {actions.map((action) => (
          <QuickAction
            key={action.to}
            label={action.label}
            to={action.to}
            icon={action.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default QuickActions;