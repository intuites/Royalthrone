import { useState } from "react";
import API from "../../services/api";
import "../../styles/adminlogin.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await API.post("/admin/forgot-password", { email });
      setMessage("If this email exists, a reset link has been sent.");
    } catch {
      setError("Unable to send reset email");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Reset Password</h2>

        {message && <p style={{ color: "#d4af37" }}>{message}</p>}
        {error && <p className="admin-error">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}
