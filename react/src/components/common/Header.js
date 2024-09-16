import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Updated to match the new location of the hook
import "../../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout(); // Using the logout function from useAuth
      navigate("/auth/login");
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out. Please try again.");
    }
  };

  const authLinks = useMemo(
    () => (
      <>
        <Link
          className="nav-link"
          to={`/profile/${user?.id}`}
          aria-label={`Profile of ${user?.username}`}
        >
          Profile
        </Link>
        <button className="nav-link" onClick={handleLogout} aria-label="Logout">
          Logout
        </button>
        <Link
          className="nav-link"
          to="/notifications"
          aria-label="Notifications"
        >
          Notifications
        </Link>
      </>
    ),
    [user, handleLogout]
  );

  const guestLinks = useMemo(
    () => (
      <>
        <Link className="nav-link" to="/login" aria-label="Login">
          Login
        </Link>
        <Link className="nav-link" to="/register" aria-label="Sign Up">
          Sign Up
        </Link>
      </>
    ),
    []
  );

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" aria-label="Homepage" className="brand-link">
            <img
              src="/logo.png"
              alt="RealTech BlogX brand logo"
              className="brand-logo"
            />
            <span className="brand-name">RealTech BlogX</span>
          </Link>
        </div>
        <nav className="nav-links">
          <Link className="nav-link home-button" to="/" aria-label="Home">
            Home
          </Link>
          {isAuthenticated ? authLinks : guestLinks}
          <Link className="nav-link" to="/archives" aria-label="Archives">
            Archives
          </Link>
        </nav>
        {error && <div className="error-message">{error}</div>}
      </div>
    </header>
  );
};

export default Header;
