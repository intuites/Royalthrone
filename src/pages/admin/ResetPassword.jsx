import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/adminlogin.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      await API.post("/admin/reset-password", {
        token,
        newPassword: password,
      });

      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch {
      setError("Invalid or expired reset link");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Set New Password</h2>

        {message && <p style={{ color: "#d4af37" }}>{message}</p>}
        {error && <p className="admin-error">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}
