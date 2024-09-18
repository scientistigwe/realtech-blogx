import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/auth/authSelectors";
import { logoutUser } from "../../features/auth/authThunks"; // Import the logout thunk
import { toast } from "react-toastify"; // Import toast
import "../../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()); // Dispatch logout thunk
      toast.success("Logged out successfully!"); // Success notification
      navigate("/"); // Redirect to home page
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Error logging out. Please try again."); // Error notification
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
