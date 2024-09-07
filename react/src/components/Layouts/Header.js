import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetCurrentUserProfile, useLogout } from "../../hooks/useAuth";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const Header = () => {
  const navigate = useNavigate();
  const { data: user, error: userError } = useGetCurrentUserProfile();
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login"); // Navigate to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isAuthenticated = !!user;

  const authLinks = useMemo(
    () => (
      <>
        <Link
          className="btn btn-outline-secondary mx-2"
          to={`/profile/${user?.id}`}
          aria-label={`Profile of ${user?.username}`}
        >
          Profile
        </Link>
        <button
          className="btn btn-outline-secondary mx-2"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
        <Link
          className="btn btn-outline-secondary mx-2"
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
        <Link
          className="btn btn-outline-secondary mx-2"
          to="/auth/login"
          aria-label="Login"
        >
          Login
        </Link>
        <Link
          className="btn btn-outline-secondary mx-2"
          to="/auth/register"
          aria-label="Sign Up"
        >
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
          <Link to="/" aria-label="Homepage" style={{ textDecoration: "none" }}>
            <img
              src="/logo.png"
              alt="RealTech BlogX brand logo"
              className="brand-logo"
              width={60}
              height={60}
              style={{ marginBottom: "20px" }}
            />
            <span
              style={{ fontSize: "2em", color: "white", marginLeft: "10px" }}
            >
              RealTech BlogX
            </span>
          </Link>
        </div>
        <nav
          className="nav-links"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginTop: "40px",
          }}
        >
          <Link
            className="btn btn-outline-secondary mx-2"
            to="/"
            aria-label="Home"
          >
            Home
          </Link>
          {isAuthenticated ? authLinks : guestLinks}
          <Link
            className="btn btn-outline-secondary mx-2"
            to="/archives"
            aria-label="Archives"
          >
            Archives
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
