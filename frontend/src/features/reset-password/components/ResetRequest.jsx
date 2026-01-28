/* eslint-disable no-unused-vars */
import { useState } from "react";

const ResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("https://backend-production-fccb.up.railway.app/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "Check your email!");
    } catch (err) {
      setMessage("Something went wrong.");
    }
  }
  return (
    <div style={{ maxWidth: "350px", margin: "20px auto" }}>
      <h2>Reset Password</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ResetRequest;
