import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "./../../api/apiClient";

import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const Header = () => {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/users/me"); // Protected endpoint to check user info
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data); // Set user data from response
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/token/logout/"); // Endpoint to handle JWT logout
      setIsAuthenticated(false);
      setUser(null);
      history.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
              <Link
                className="btn btn-outline-secondary mx-2"
                to="/notifications"
                aria-label="Notifications"
              >
                Notifications
              </Link>
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
