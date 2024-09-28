import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/auth/authSelectors";
import { logoutUser } from "../../redux/auth/authThunks";
import { selectIsAdmin } from "../../redux/user/usersSelectors";
import {
  fetchCurrentUser,
  fetchAdminStatus,
} from "../../redux/user/usersThunk";
import { toast } from "react-toastify";
import styled from "styled-components";

// Styled Components
const HeaderContainer = styled.header`
  background-color: #dcdcdc; /* White background */
  color: #000000; /* Black text */
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for separation */
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  .brand-logo {
    height: 40px;
    margin-right: 0.5rem;
  }

  .brand-name {
    font-size: 2.5rem;
    font-weight: 600;
    color: #ff7f00; /* Orange color for "RealTech BlogX" */
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;

  .nav-link {
    color: #000000; /* Black text */
    text-decoration: none;
    margin-left: 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #ff7f00; /* Orange on hover */
    }
  }

  .nav-link-admin {
    color: #ff7f00; /* Orange for admin-related links */
  }
`;

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
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/" aria-label="Homepage">
          <img
            src="/logo.png"
            alt="RealTech BlogX brand logo"
            className="brand-logo"
          />
          <span className="brand-name">RealTech BlogX</span>
        </Logo>
        <NavLinks>
          <Link className="nav-link" to="/" aria-label="Home">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <button
                className="nav-link"
                onClick={handleFetchCurrentUser}
                aria-label="Profile"
              >
                Profile
              </button>
              <Link
                className="nav-link"
                to="/published-posts"
                aria-label="Published Posts"
              >
                Published Posts
              </Link>
              {isAdmin && (
                <Link
                  className="nav-link nav-link-admin"
                  to="/draft-posts"
                  aria-label="Draft Posts"
                >
                  Draft Posts
                </Link>
              )}
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
                className="nav-link nav-link-admin"
                to="/admin-login"
                aria-label="Admin Login"
              >
                Admin
              </Link>
            </>
          )}
          {isAdmin && (
            <button
              className="nav-link nav-link-admin"
              onClick={handleFetchAdminStatus}
              aria-label="Admin Dashboard"
            >
              Admin Dashboard
            </button>
          )}
        </NavLinks>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
