import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useRegister from "./../../hooks/userAuth";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const initialFormData = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  bio: "",
  website: "",
  location: "",
  facebook: "",
  twitter: "",
  linkedin: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const { register, loading, error, message } = useRegister();
  const [errorState, setError] = useState(""); // Define setError using useState
  const navigate = useNavigate();
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.root.setAttribute("spellcheck", false);
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (formData.first_name.length > 150)
      errors.first_name = "First name must be 150 characters or fewer";
    if (formData.last_name.length > 150)
      errors.last_name = "Last name must be 150 characters or fewer";

    const usernameRegex = /^[\w.@+-]+$/;
    if (
      !usernameRegex.test(formData.username) ||
      formData.username.length > 150 ||
      formData.username.length < 1
    ) {
      errors.username =
        "Username must be 1-150 characters. Only letters, digits, and @/./+/-/_ are allowed.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email) || formData.email.length > 254) {
      errors.email = "Enter a valid email address (max 254 characters)";
    }

    if (formData.password.length < 1 || formData.password.length > 128) {
      errors.password = "Password must be 1-128 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (formData.website && formData.website.length > 200) {
      errors.website = "Website URL must be 200 characters or fewer";
    }

    if (formData.location && formData.location.length > 100) {
      errors.location = "Location must be 100 characters or fewer";
    }

    if (isAuthor) {
      if (!formData.facebook && !formData.twitter && !formData.linkedin) {
        errors.socialMedia =
          "At least one social media handle is required for authors.";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBioChange = (content) => {
    setFormData((prevData) => ({ ...prevData, bio: content }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);
      setError(""); // Clear any previous errors
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(
        "Please correct the following errors: " +
          Object.values(errors).join(", ")
      );
      return;
    }

    try {
      const data = await register(formData, profilePicture, isAuthor);
      if (data) {
        navigate(`/profile/${data.user_id}/`);
      }
    } catch (err) {
      // Error handled by the hook
    }
  };

  return (
    <Container className="register-container mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="register-heading text-center">Register</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {errorState && <Alert variant="danger">{errorState}</Alert>}{" "}
          {/* Use errorState here */}
          <Form onSubmit={handleSubmit} className="register-form">
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                pattern="^[\w.@+-]+$"
                maxLength={150}
                required
                title="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={254}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={128}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={128}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.bio}
                onChange={handleBioChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                maxLength={200}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isAuthor"
                label="Register as Author"
                checked={isAuthor}
                onChange={(e) => setIsAuthor(e.target.checked)}
              />
            </Form.Group>
            {isAuthor && (
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </Form.Group>
              </div>
            )}
            <Button
              type="submit"
              className="w-100"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
