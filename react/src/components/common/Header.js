import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

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
          {isAuthenticated ? (
            <>
              <Link className="nav-link" to="/profile" aria-label="Profile">
                Profile
              </Link>
              <button
                className="nav-link"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login" aria-label="Login">
                Login
              </Link>
              <Link className="nav-link" to="/register" aria-label="Sign Up">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
