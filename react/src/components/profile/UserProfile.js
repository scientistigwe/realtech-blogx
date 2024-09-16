import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Image,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import { useUsers } from "../../hooks/useUsers"; // Adjust the path as necessary
import "../../styles/Users.css";

const defaultAvatar = "path/to/default-avatar.png"; // Path to your default avatar image

const UserProfile = () => {
  const {
    getCurrentUserProfile,
    updateUser,
    partialUpdateUser, // Now we will use this
    deleteUser,
    loading,
    error: apiError,
  } = useUsers();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    website: "",
    location: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getCurrentUserProfile();
        if (data) {
          setUser(data);
          setFormData({
            username: data.username || "",
            email: data.email || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            bio: data.bio || "",
            website: data.website || "",
            location: data.location || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setFormError("Failed to load profile.");
      }
    };

    fetchUserProfile();
  }, [getCurrentUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      alert("Profile deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user profile:", error);
      setFormError("Failed to delete profile.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateUser(user.id, formData);
        setUser({ ...user, ...formData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user profile:", error);
      setFormError("Failed to update profile.");
    }
  };

  // New function for partial update of the bio field
  const handlePartialUpdate = async () => {
    try {
      const partialData = { bio: formData.bio }; // Only update the bio
      await partialUpdateUser(user.id, partialData);
      setUser({ ...user, bio: formData.bio });
      alert("Bio updated successfully.");
    } catch (error) {
      console.error("Failed to partially update user profile:", error);
      setFormError("Failed to update bio.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
      </Breadcrumb>
      {formError && <Alert variant="danger">{formError}</Alert>}
      {apiError && <Alert variant="danger">{apiError}</Alert>}
      {loading && <Alert variant="info">Loading...</Alert>}
      {user && (
        <>
          <h1>User Profile</h1>
          <Image
            src={user.profile_picture || defaultAvatar}
            roundedCircle
            className="profile-picture"
            alt="Profile"
          />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="website">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={formData.website}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                className="ms-2"
              >
                Cancel
              </Button>
            )}
            {isEditing && (
              <Button variant="danger" onClick={handleDelete} className="ms-2">
                Delete Profile
              </Button>
            )}
            {isEditing && (
              <Button
                variant="warning"
                onClick={handlePartialUpdate}
                className="ms-2"
              >
                Update Bio Only
              </Button>
            )}
          </Form>
        </>
      )}
    </Container>
  );
};

export default UserProfile;
