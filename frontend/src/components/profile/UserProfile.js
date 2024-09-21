import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Accordion } from "react-bootstrap";
import { fetchUserProfile } from "../../redux/auth/authThunks";
import UserProfileCard from "./ProfileCard";
import UpdateProfile from "./UpdateProfile";
import styled from "styled-components";
import { ChevronDown, ChevronUp, Bell, LayoutDashboard } from "lucide-react";

const StyledUserProfile = styled.div`
  padding: 2rem 0 4rem;
  min-height: calc(100vh - 200px);
  background-color: #f8f9fa;

  .profile-container {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .sidebar {
    background-color: #f1f3f5;
    padding: 1.5rem;
    height: 100%;
  }

  .accordion-button {
    padding: 0.75rem 1rem;
    font-weight: 500;
    color: #495057;
    background-color: transparent;
    border: none;
    box-shadow: none;

    &:not(.collapsed) {
      color: #0056b3;
      background-color: transparent;
    }

    &:focus {
      box-shadow: none;
    }

    &::after {
      display: none;
    }
  }

  .accordion-body {
    padding: 0.5rem 1rem;
  }

  .sidebar-item {
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: #495057;
    transition: all 0.3s ease;

    &:hover,
    &.active {
      background-color: #e9ecef;
      color: #212529;
    }
  }

  .standalone-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.75rem 1rem;
    color: #495057;
    transition: all 0.3s ease;
    margin-top: 0.5rem;

    &:hover,
    &.active {
      background-color: #e9ecef;
      color: #212529;
    }

    svg {
      margin-right: 0.5rem;
    }
  }

  .content-area {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .sidebar {
      margin-bottom: 1rem;
    }
  }
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Already imported
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const [activeComponent, setActiveComponent] = useState("profile");

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, navigate, isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Alert variant="warning">Please log in to view your profile.</Alert>;
  }

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <UserProfileCard user={user} />;
      case "updateProfile":
        return <UpdateProfile user={user} />;
      // Add other cases as needed
      default:
        return <UserProfileCard user={user} />;
    }
  };

  const menuItems = {
    account: [
      { key: "profile", label: "Profile" },
      { key: "updateProfile", label: "Update Profile" },
      { key: "resetPassword", label: "Reset Password" },
      { key: "deleteAccount", label: "Delete Account" },
    ],
    posts: [
      { key: "createPost", label: "Create Post", route: "/create-post" }, // Add route here
      { key: "postList", label: "Post List" },
      { key: "deletePost", label: "Delete Post" },
      { key: "updatePost", label: "Update Post" },
    ],
  };

  return (
    <StyledUserProfile>
      <Container>
        <Row className="profile-container">
          <Col md={3} className="sidebar">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Account
                  {activeComponent === "0" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </Accordion.Header>
                <Accordion.Body>
                  {menuItems.account.map((item) => (
                    <div
                      key={item.key}
                      className={`sidebar-item ${
                        activeComponent === item.key ? "active" : ""
                      }`}
                      onClick={() => setActiveComponent(item.key)}
                    >
                      {item.label}
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  Posts
                  {activeComponent === "1" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </Accordion.Header>
                <Accordion.Body>
                  {menuItems.posts.map((item) => (
                    <div
                      key={item.key}
                      className={`sidebar-item ${
                        activeComponent === item.key ? "active" : ""
                      }`}
                      onClick={() => {
                        if (item.route) {
                          navigate(item.route); // Use navigate for route-based items
                        } else {
                          setActiveComponent(item.key);
                        }
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div
              className={`standalone-item ${
                activeComponent === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveComponent("dashboard")}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </div>
            <div
              className={`standalone-item ${
                activeComponent === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveComponent("notifications")}
            >
              <Bell size={20} />
              Notifications
            </div>
          </Col>
          <Col md={9} className="content-area">
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <Alert variant="info">Loading...</Alert>
            ) : (
              renderActiveComponent()
            )}
          </Col>
        </Row>
      </Container>
    </StyledUserProfile>
  );
};

export default UserProfile;
