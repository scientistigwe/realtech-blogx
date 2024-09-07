import React from "react";
import { useParams } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { useGetUserById } from "./../../hooks/useAuth"; // Import the correct hook for fetching user profile
import { useGetCurrentProfile } from "../../hooks/useUsers"; // Import the correct hook for fetching current user profile
import ContactAuthor from "./ContactAuthor"; // Import the ContactAuthor component

const AuthorDetail = () => {
  const { id } = useParams();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useGetUserById(id); // Fetch user profile
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useGetCurrentProfile(); // Fetch current authenticated user

  if (profileLoading || authLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (profileError || authError) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">
          {profileError?.message || authError?.message}
        </Alert>
      </div>
    );
  }

  const isStaffOrAdmin = user?.role === "staff" || user?.role === "admin";

  return (
    <div className="author-detail-page container mt-4">
      {profile ? (
        <>
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>

          {user?.role === "visitor" && (
            <div>
              <h3>Posts by {profile.username}</h3>
              {/* Render posts by author here */}
            </div>
          )}

          {isStaffOrAdmin && (
            <div className="mt-4">
              <ContactAuthor />
            </div>
          )}
        </>
      ) : (
        <p className="text-center">No author found.</p>
      )}
    </div>
  );
};

export default AuthorDetail;
