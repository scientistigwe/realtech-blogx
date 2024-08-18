import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
  clearError,
} from "../../redux/slices/userSlice";
import {
  selectUserProfile,
  selectUserError,
  selectUserLoading,
  selectUserState,
} from "../../redux/selectors/userSelectors"; // Adjusted imports
import "../../styles/Pages.css";

const ProfileUpdateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector(selectUserProfile);
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const { id, success } = useSelector(selectUserState); // Use selectUserState to get id and success

  const [formData, setFormData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id)); // Fetch profile using id
    }
    return () => dispatch(clearError());
  }, [dispatch, id]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && key !== "profile_picture") {
          dataToSend.append(key, formData[key]);
        }
      });
      if (newProfilePicture) {
        dataToSend.append("profile_picture", newProfilePicture);
      }
      await dispatch(updateUserProfile({ id, data: dataToSend }));
      setTimeout(() => navigate(`/profile/${id}/`), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="container mt-4">
      <h1>Update Profile</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        {[
          "username",
          "first_name",
          "last_name",
          "email",
          "bio",
          "website",
          "location",
        ].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </label>
            {field === "bio" ? (
              <textarea
                className="form-control"
                id={field}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
              />
            ) : (
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "website"
                    ? "url"
                    : "text"
                }
                className="form-control"
                id={field}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                required={["username", "email"].includes(field)}
              />
            )}
          </div>
        ))}
        <div className="mb-3">
          <label htmlFor="profile_picture" className="form-label">
            Profile Picture
          </label>
          {formData.profile_picture && (
            <img
              src={formData.profile_picture}
              alt="Current profile"
              className="mb-2 d-block"
              style={{ maxWidth: "200px" }}
            />
          )}
          <input
            type="file"
            className="form-control"
            id="profile_picture"
            name="profile_picture"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-3">
          <label>
            <input
              type="checkbox"
              name="is_author"
              checked={formData.is_author || false}
              onChange={handleChange}
            />
            Register as Author
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
