import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../../api/apiClient"; // Ensure this is correctly aligned with your API client

const PasswordReset = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    try {
      if (mode === "request") {
        // Handle password reset request
        await api.auth.resetPassword({ email });
        setMessage("A password reset link has been sent to your email.");
      } else if (mode === "reset") {
        // Handle password reset
        await api.auth.resetPasswordConfirm({ currentPassword, newPassword });
        setMessage("Password has been updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after a brief delay
        }, 2000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to perform the operation. Please try again."
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="password-reset-page container mt-4">
      <h2>
        {mode === "request" ? "Request Password Reset" : "Reset Password"}
      </h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {mode === "request" ? (
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <>
            <div>
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit" disabled={loading}>
          {loading
            ? "Processing..."
            : mode === "request"
            ? "Send Reset Link"
            : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
