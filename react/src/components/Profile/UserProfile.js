import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import {
  selectUserProfile,
  selectUserLoading,
  selectUserError,
} from "../../redux/selectors/userSelectors"; // Import selectors
import "../../styles/Pages.css";

const Profile = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  // Assume id is obtained from some source, e.g., auth state, URL params, etc.
  const id = "user-id-from-auth-or-params"; // Replace with actual id

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id)); // Pass id to the action
    }
  }, [dispatch, id]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  if (!profile)
    return <div className="text-center mt-4">No profile data available</div>;

  return (
    <div className="container mt-4 profile-page">
      <h1 className="mb-4 text-center">Profile Page</h1>
      <div className="profile-section mb-4 p-4 rounded shadow-sm">
        <div className="profile-container">
          <div className="profile-picture">
            <img
              src={profile.profilePicture || "default-avatar.png"}
              alt="Profile"
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="profile-details">
            <h2>{profile.firstname}</h2>
            <p className="profile-email">Email: {profile.email}</p>
            <p className="profile-bio">Bio: {profile.bio}</p>
            <p>Location: {profile.location}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
