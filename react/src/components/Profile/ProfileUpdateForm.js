import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserProfile } from "./../../hooks/useUser";
import "../../styles/Pages.css";

const ProfileUpdateForm = ({ onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { profile, loading, error, updateProfile } = useUserProfile(id);
  const [formData, setFormData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [success, setSuccess] = useState("");

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
      await updateProfile(dataToSend);
      setSuccess("Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setSuccess(""); // Clear success message on error
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="container mt-4">
      <h1>Update Profile</h1>
      {error && <div className="alert alert-danger">{error.message}</div>}
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
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
