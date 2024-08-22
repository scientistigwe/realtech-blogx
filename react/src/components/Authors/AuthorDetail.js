import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { useUserProfile } from "./../../hooks/useUser";
import { useUserRole } from "./../../hooks/useUser";
import ContactAuthor from "./ContactAuthor"; // Import the ContactAuthor component

const AuthorDetail = () => {
  const { id } = useParams();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile(id);
  const { role, loading: roleLoading, error: roleError } = useUserRole();

  if (profileLoading || roleLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (profileError || roleError) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">
          {profileError?.message || roleError?.message}
        </Alert>
      </div>
    );
  }

  return (
    <div className="author-detail-page container mt-4">
      {profile ? (
        <>
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>

          {role === "visitor" && (
            <div>
              <h3>Posts by {profile.name}</h3>
              {/* Render posts by author here */}
            </div>
          )}

          {(role === "staff" || role === "admin") && (
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
