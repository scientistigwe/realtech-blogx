import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/auth/authSelectors";
import { logoutUser } from "../../redux/auth/authThunks";
import {
  selectUsersState,
  selectIsAdmin,
} from "../../redux/user/usersSelectors";
import {
  fetchCurrentUser,
  fetchAdminStatus,
} from "../../redux/user/usersThunk";
import { toast } from "react-toastify";
import "../../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Error logging out. Please try again.");
    }
  };

  const handleFetchCurrentUser = async () => {
    try {
      await dispatch(fetchCurrentUser());
      toast.success("Profile fetched successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error("Error fetching profile. Please try again.");
      console.error("Error fetching current user:", err);
    }
  };

  const handleFetchAdminStatus = async () => {
    try {
      await dispatch(fetchAdminStatus());
      toast.success("Admin status verified successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      toast.error("Error verifying admin status. Please try again.");
      console.error("Error checking admin status:", err);
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
              {/* User Profile */}
              <button
                className="nav-link"
                onClick={handleFetchCurrentUser}
                aria-label="Profile"
              >
                Profile
              </button>
              {/* Published Posts */}
              <Link
                className="nav-link"
                to="/published-posts"
                aria-label="Published Posts"
              >
                Published Posts
              </Link>
              {/* Draft Posts for admin only */}
              {isAdmin && (
                <Link
                  className="nav-link"
                  to="/draft-posts"
                  aria-label="Draft Posts"
                >
                  Draft Posts
                </Link>
              )}
              {/* Logout */}
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
              <Link
                className="nav-link"
                to="/admin-login"
                aria-label="Admin Login"
              >
                Admin
              </Link>
            </>
          )}
          {isAdmin && (
            <button
              className="nav-link"
              onClick={handleFetchAdminStatus}
              aria-label="Admin Dashboard"
            >
              Admin Dashboard
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
