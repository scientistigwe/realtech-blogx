import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { requestPasswordReset, updatePassword } from "../../redux/authService"; // Ensure this path is correct
import { selectAuthLoading } from "../../redux/selectors/authSelectors"; // Ensure this path is correct

const PasswordReset = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Correctly defined only once

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(""); // Clear any previous errors

    try {
      if (mode === "request") {
        // Handle password reset request
        await dispatch(requestPasswordReset(email)).unwrap();
        setMessage("A password reset link has been sent to your email.");
      } else if (mode === "reset") {
        // Handle password reset
        await dispatch(
          updatePassword({ currentPassword, newPassword })
        ).unwrap();
        setMessage("Password has been updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          navigate("/auth/login"); // Redirect to login page after a brief delay
        }, 2000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.message || "Failed to perform the operation. Please try again."
      );
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
