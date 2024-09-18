// UpdateProfile.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Alert } from "react-bootstrap";
import { updateUserById } from "../../features/auth/authThunks";

const UpdateProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    bio: user.bio || "",
    website: user.website || "",
    location: user.location || "",
  });
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserById({ id: user.id, data: formData })).unwrap();
      setFormError("");
      alert("Profile updated successfully!");
    } catch (error) {
      setFormError("Failed to update profile. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {formError && <Alert variant="danger">{formError}</Alert>}
      <Form.Group controlId="first_name">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="last_name">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="last_name"
          value={formData.last_name}
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
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="website">
        <Form.Label>Website</Form.Label>
        <Form.Control
          type="text"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Update Profile
      </Button>
    </Form>
  );
};

export default UpdateProfile;
