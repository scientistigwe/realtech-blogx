// components/users/UserProfile.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Image,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import { usersService } from "../../services/usersService";
import "../../styles/Users.css";

const defaultAvatar = "path/to/default-avatar.png"; // Path to your default avatar image

const UserProfile = () => {
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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await usersService.getCurrentUserProfile();
        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio || "",
          website: data.website || "",
          location: data.location || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to load profile.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async () => {
    try {
      await usersService.deleteUser(user.id);
      // Optionally, redirect to another page or show a success message
      alert("Profile deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user profile:", error);
      setError("Failed to delete profile.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await usersService.updateUser(user.id, formData);
        setUser({ ...user, ...formData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user profile:", error);
      setError("Failed to update profile.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
      </Breadcrumb>
      {error && <Alert variant="danger">{error}</Alert>}
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
            <Form.Group controlId="social_profiles">
              <Form.Label>Social Profiles</Form.Label>
              <Form.Control
                type="text"
                name="social_profiles"
                value={
                  user.social_profiles
                    ? JSON.stringify(user.social_profiles)
                    : ""
                }
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="last_active">
              <Form.Label>Last Active</Form.Label>
              <Form.Control
                type="text"
                name="last_active"
                value={user.last_active}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="is_author">
              <Form.Label>Is Author</Form.Label>
              <Form.Control
                type="text"
                name="is_author"
                value={user.is_author ? "Yes" : "No"}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={user.role}
                readOnly
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
          </Form>
        </>
      )}
    </Container>
  );
};

export default UserProfile;
