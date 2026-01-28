import styles from "./Button.module.css";

const Button = ({
  variant = "primary", // primary | outline | purple
  size = "md", // sm | md | lg
  children,
  ...props
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
