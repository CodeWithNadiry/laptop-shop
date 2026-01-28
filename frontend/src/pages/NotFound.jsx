import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  // CSS variables
  const styles = {
    container: {
      "--bg-color": "#f8f9fa",
      "--text-color": "#333",
      "--highlight-color": "#0277ce",
      "--btn-bg-color": "#0277ce",
      "--btn-text-color": "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      textAlign: "center",
      padding: "0 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    code: {
      fontSize: "10rem",
      fontWeight: "bold",
      color: "var(--highlight-color)",
      margin: "0",
    },
    title: {
      fontSize: "2rem",
      margin: "10px 0",
    },
    message: {
      fontSize: "1.2rem",
      margin: "10px 0 20px 0",
    },
    button: {
      backgroundColor: "var(--btn-bg-color)",
      color: "var(--btn-text-color)",
      border: "none",
      padding: "12px 30px",
      borderRadius: "5px",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      textDecoration: "none",
    },
    buttonHover: {
      backgroundColor: "#1696f7ff",
    },
  };

  // Button hover effect
  const [hover, setHover] = React.useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.message}>
        Oops! The page you’re looking for does not exist.
      </p>
      <Link
        to="/"
        style={{
          ...styles.button,
          ...(hover ? styles.buttonHover : {}),
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
