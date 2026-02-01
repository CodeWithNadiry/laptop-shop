import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css"; // Import the CSS Module

const Signup = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (userInput.password !== userInput.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://laptop-shop-production.up.railway.app//auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInput.name,
          email: userInput.email,
          password: userInput.password,
          confirmPassword: userInput.confirmPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSuccess("Account created successfully! You can login now.");
      setError(null);
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Account</h1>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={userInput.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={userInput.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={`${styles.input} ${styles.passwordInput}`}
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            className={`${styles.input} ${styles.passwordInput}`}
            type="password"
            name="confirmPassword"
            value={userInput.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Sign Up
        </button>
      </form>

      <Link to="/auth/login" className={styles.loginLink}>
        Already have an account? Sign In
      </Link>
    </div>
  );
};

export default Signup;