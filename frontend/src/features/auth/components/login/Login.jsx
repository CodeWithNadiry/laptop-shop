import { useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Import the CSS Module

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-production-fccb.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login Failed");

      login({
        token: data.token,
        userId: data.userId,
        role: data.role,
      });

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // ✅ Navigate to signup page
  function handleCreateAccount() {
    navigate("/auth/signup");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
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
          <div className={styles.labelWrapper}>
            <label className={styles.label}>Password</label>
            <span
              className={styles.forgotPassword}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/auth/reset")}
            >
              Forgot password?
            </span>
          </div>
          <input
            className={`${styles.input} ${styles.passwordInput}`}
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Sign In
        </button>
      </form>

      <span
        className={styles.createAccount}
        onClick={handleCreateAccount}
        style={{ cursor: "pointer" }}
      >
        Create account
      </span>
    </div>
  );
};

export default Login;
