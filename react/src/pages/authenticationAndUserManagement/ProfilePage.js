import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Breadcrumb, Button, Row, Col } from "react-bootstrap";
import Profile from "../../components/Profile/UserProfile";
import ProfileUpdateForm from "../../components/Profile/ProfileUpdateForm";
import PostList from "../../components/Posts/PostList";
import { useUserProfile } from "../../hooks/useUser"; // Custom hook to fetch and update user profile

const ProfilePage = () => {
  const { id } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);

  // Use custom hook to manage user profile
  const { profile, loading, error, refetchProfile } = useUserProfile(id);

  useEffect(() => {
    if (profile && id) {
      refetchProfile(id); // Refetch profile if needed
    }
  }, [id, profile, refetchProfile]);

  if (loading)
    return <div className="text-center mt-4">Loading profile...</div>;
  if (error)
    return <div className="alert alert-danger">Error: {error.message}</div>;

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Profile</Breadcrumb.Item>
      </Breadcrumb>

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
            <h2>
              Posts by {profile.firstname} {profile.lastname}
            </h2>
            <PostList userId={id} />
          </Col>
        </Row>
      ) : (
        <div className="text-center mt-4">No profile data available.</div>
      )}
    </Container>
  );
};

export default ProfilePage;
