import React from "react";
import { useParams } from "react-router-dom";
import { useGetCurrentUserProfile } from "./../../hooks/useAuth";
import { useGetUserById } from "./../../hooks/useAuth"; // Adjust the import if necessary
import "../../styles/Pages.css";

const UserProfile = () => {
  const { profile, error: profileError } = useGetCurrentUserProfile();
  const { user } = useGetUserById(); // Assuming useAuth provides current user information

  if (!profile && profileError) {
    return (
      <div className="alert alert-danger" role="alert">
        {profileError}
      </div>
    );
  }

  return (
    <div className="container mt-4 profile-page">
      <h1 className="mb-4 text-center">User Profile</h1>
      {profile && (
        <div className="profile-section mb-4 p-4 rounded shadow-sm">
          <div className="profile-container d-flex align-items-center">
            <div className="profile-picture">
              <img
                src={profile.profile_picture || "/default-avatar.png"}
                alt="Profile"
                className="img-fluid rounded-circle"
                width={150}
                height={150}
              />
            </div>
            <div className="profile-details ms-4">
              <h2>
                {profile.first_name} {profile.last_name}
              </h2>
              <p>Username: {profile.username}</p>
              <p>Email: {profile.email}</p>
              <p>
                Biography:{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: profile.bio || "Not provided",
                  }}
                />
              </p>
              <p>Location: {profile.location || "Not provided"}</p>
              <p>
                Website:{" "}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.website}
                  </a>
                )}
              </p>
              <p>
                Twitter:{" "}
                {profile.social_profiles?.twitter && (
                  <a
                    href={profile.social_profiles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.social_profiles.twitter}
                  </a>
                )}
              </p>
              <p>
                Facebook:{" "}
                {profile.social_profiles?.facebook && (
                  <a
                    href={profile.social_profiles.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.social_profiles.facebook}
                  </a>
                )}
              </p>
              <p>
                LinkedIn:{" "}
                {profile.social_profiles?.linkedin && (
                  <a
                    href={profile.social_profiles.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.social_profiles.linkedin}
                  </a>
                )}
              </p>
              <p>Role: {profile.role}</p>
              <p>Last Active: {profile.last_active || "Not available"}</p>
              {profile.is_author && <p>Author Status: Author</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
