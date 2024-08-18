import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

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
              height={100}
              style={{
                marginBottom: "20px",
              }}
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
          {isAuthenticated && user ? (
            <>
              <Link
                className="btn btn-outline-secondary mx-2"
                to={`/profile/${user.id}`}
                aria-label={`Profile of ${user.username}`}
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
            </>
          ) : (
            <>
              <Link
                className="btn btn-outline-secondary mx-2"
                to="/login"
                aria-label="Login"
              >
                Login
              </Link>
              <Link
                className="btn btn-outline-secondary mx-2"
                to="/register"
                aria-label="Sign Up"
              >
                Sign Up
              </Link>
            </>
          )}
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
