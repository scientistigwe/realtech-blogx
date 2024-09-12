import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import { usersService } from "../../services/usersService";
import Breadcrumbs from "./Breadcrumbs";
import "../../styles/Header.css";
import { debounce } from "lodash";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const isAuth = await authService.checkAuth();
      if (isAuth) {
        const userProfile = await usersService.getCurrentUserProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile. Please try again later.");
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const debouncedFetchUserProfile = useMemo(
    () => debounce(fetchUserProfile, 1000),
    [fetchUserProfile]
  );

  useEffect(() => {
    debouncedFetchUserProfile();
    return () => debouncedFetchUserProfile.cancel();
  }, [debouncedFetchUserProfile]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
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

  // Determine breadcrumb items based on the current location
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { label: "Home", link: "/" },
      ...pathnames.map((path, index) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1), // Capitalize breadcrumb
        link: `/${pathnames.slice(0, index + 1).join("/")}`,
      })),
    ];
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
        <Breadcrumbs crumbs={getBreadcrumbs()} />
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
