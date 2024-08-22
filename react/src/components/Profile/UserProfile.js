import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserProfile, useUpdateUserProfile } from "./../../hooks/useUser";
import "../../styles/Pages.css";

const UserProfile = () => {
  const { username } = useParams();
  const { profile, loading, error } = useUserProfile(username);
  const {
    updateProfile,
    loading: updateLoading,
    error: updateError,
  } = useUpdateUserProfile();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    );
  }

  return (
    <div className="container mt-4 profile-page">
      <h1 className="mb-4 text-center">User Profile</h1>
      <div className="profile-section mb-4 p-4 rounded shadow-sm">
        <div className="profile-container">
          <div className="profile-picture">
            <img
              src={profile?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="img-fluid rounded-circle"
              width={150}
              height={150}
            />
          </div>
          <div className="profile-details">
            <h2>
              {profile?.firstname} {profile?.lastname}
            </h2>
            <p className="profile-email">Email: {profile?.email}</p>
            <p className="profile-bio">Bio: {profile?.bio}</p>
            <p>Location: {profile?.location}</p>
            <p>
              Website:{" "}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </a>
              )}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <h3>Update Profile</h3>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">
              Bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          {updateLoading && <div>Updating profile...</div>}
          {updateError && (
            <div className="alert alert-danger">{updateError.message}</div>
          )}
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
