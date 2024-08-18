// ProfilePage.js

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Breadcrumb, Button, Row, Col } from "react-bootstrap";
import Profile from "../components/Profile/UserProfile";
import ProfileUpdateForm from "../components/Profile/ProfileUpdateForm";
import PostList from "../components/Posts/PostList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchCurrentUserProfile,
} from "../redux/slices/userSlice";

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const { profile, loading, error } = useSelector((state) => ({
    profile: state.user.profile,
    loading: state.user.loading,
    error: state.user.error,
  }));

  useEffect(() => {
    if (id && id !== "undefined") {
      dispatch(fetchUserProfile(id));
    } else {
      dispatch(fetchCurrentUserProfile());
    }
  }, [dispatch, id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: Failed to fetch user profile: {error}</div>;

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Profile</Breadcrumb.Item>
      </Breadcrumb>

      <h1>User Profile</h1>

      <h1>User Profile</h1>

      {profile ? (
        <Row>
          <Col md={4}>
            {isUpdating ? (
              <ProfileUpdateForm onCancel={() => setIsUpdating(false)} />
            ) : (
              <>
                <Button
                  onClick={() => setIsUpdating(true)}
                  variant="primary"
                  className="mb-3"
                >
                  Update Profile
                </Button>
                <Profile profile={profile} />
              </>
            )}
          </Col>
          <Col md={8}>
            <h2>Posts by {profile.name}</h2>
            <PostList userId={id} />
          </Col>
        </Row>
      ) : (
        <div>No profile data available.</div>
      )}
    </Container>
  );
};

export default ProfilePage;
