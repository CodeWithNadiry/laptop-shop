/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css"; // CSS Module

const UserProfile = () => {
  const { token, userId, logout } = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "", email: "" });
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      if (!token || !userId) return;

      try {
        const res = await fetch(`https://laptop-shop-production.up.railway.app/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
        setNewName(data.name);
      } catch (err) {
        setMessage("Failed to load user data.");
      }
    }

    fetchUser();
  }, [token, userId]);

  async function handleUpdateName() {
    try {
      const res = await fetch(`https://laptop-shop-production.up.railway.app/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await res.json();
      setMessage(data.message);
      setUser((prev) => ({ ...prev, name: newName }));
    } catch (err) {
      setMessage("Failed to update username.");
    }
  }

  async function requestPasswordReset() {
    try {
      const res = await fetch(`https://laptop-shop-production.up.railway.app/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Failed to send reset email.");
    }
  }

  async function handleDeleteAccount() {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://laptop-shop-production.up.railway.app/auth/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        logout();
        navigate("/auth/signup");
      }
    } catch (err) {
      setMessage("Failed to delete account.");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Profile</h2>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.field}>
        <label>Email</label>
        <p className={styles.email}>{user.email}</p>
      </div>

      <div className={styles.field}>
        <label>Username</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={styles.input}
        />
        <button className={styles.btn} onClick={handleUpdateName}>
          Update Username
        </button>
      </div>

      <div className={styles.field}>
        <button className={styles.btnSecondary} onClick={requestPasswordReset}>
          Send Password Reset Email
        </button>
      </div>

      <div className={styles.field}>
        <button className={styles.btnDanger} onClick={handleDeleteAccount}>
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default UserProfile;