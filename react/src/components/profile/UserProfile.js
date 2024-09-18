// UserProfile.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Alert } from "react-bootstrap";
import { fetchUserProfile, checkAuth } from "../../features/auth/authThunks";
import UserProfileCard from "./ProfileCard";
import UpdateProfile from "./UpdateProfile";
// import ResetPassword from "./ResetPassword";
// import DeleteAccount from "./DeleteAccount";
// import UserPosts from "./UserPosts";
import "../../styles/UserProfile.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const [activeComponent, setActiveComponent] = useState("profile");

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
        if (!user) {
          dispatch(fetchUserProfile());
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [dispatch, navigate, user]);

  if (!isAuthenticated) {
    return <Alert variant="warning">Please log in to view your profile.</Alert>;
  }

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <UserProfileCard user={user} />;
      case "update":
        return <UpdateProfile user={user} />;
      // case "resetPassword":
      //   return <ResetPassword />;
      // case "deleteAccount":
      //   return <DeleteAccount />;
      // case "posts":
      //   return <UserPosts userId={user.id} />;
      default:
        return <UserProfileCard user={user} />;
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md={3}>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveComponent("profile")}>
              Profile
            </Nav.Link>
            <Nav.Link onClick={() => setActiveComponent("update")}>
              Update Profile
            </Nav.Link>
            <Nav.Link onClick={() => setActiveComponent("resetPassword")}>
              Reset Password
            </Nav.Link>
            <Nav.Link onClick={() => setActiveComponent("deleteAccount")}>
              Delete Account
            </Nav.Link>
            <Nav.Link onClick={() => setActiveComponent("posts")}>
              My Posts
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={9}>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Alert variant="info">Loading...</Alert>
          ) : (
            renderActiveComponent()
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;

// // Placeholder components for other actions
// // ResetPassword.js
// import React from "react";

// const ResetPassword = () => {
//   return <h2>Reset Password Component (To be implemented)</h2>;
// };

// export default ResetPassword;

// // DeleteAccount.js
// import React from "react";

// const DeleteAccount = () => {
//   return <h2>Delete Account Component (To be implemented)</h2>;
// };

// export default DeleteAccount;

// // UserPosts.js
// import React from "react";

// const UserPosts = ({ userId }) => {
//   return <h2>User Posts Component for user {userId} (To be implemented)</h2>;
// };

// export default UserPosts;
