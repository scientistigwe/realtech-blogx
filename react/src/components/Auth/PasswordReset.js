import React from "react";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks/useAuth"; // Adjust import path as necessary

const PasswordReset = ({ mode }) => {
  const {
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    message,
    error,
    loading,
    handleSubmit,
  } = useResetPassword(mode);

  const navigate = useNavigate();

  // Redirect after successful password reset
  React.useEffect(() => {
    if (message && mode === "reset") {
      setTimeout(() => {
        navigate("/auth/login"); // Redirect to login page after a brief delay
      }, 2000);
    }
  }, [message, mode, navigate]);

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
