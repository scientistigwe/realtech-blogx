import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FormInput, PasswordInput } from "./../common/FormComponents";
import { useForm } from "./../../hooks/UseForm";
import { register } from "../../redux/slices/authSlice";
import { uploadProfilePicture } from "../../api/users";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthLoading } from "../../redux/selectors/authSelectors"; // Import selectors
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
  const { formData, handleChange, setFormData } = useForm(initialFormData);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Define state for errors
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading); // Use selector for loading state
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

  const handleBioChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      bio: content,
    }));
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
    setMessage("");
    setError(""); // Reset error state

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(
        "Please correct the following errors: " +
          Object.values(errors).join(", ")
      );
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formDataToSend.append(key, value);
        }
      });

      // Append author-specific fields
      formDataToSend.append("is_author", isAuthor);
      if (isAuthor) {
        formDataToSend.append("facebook_profile", formData.facebook || "");
        formDataToSend.append("twitter_handle", formData.twitter || "");
        formDataToSend.append("linkedin_profile", formData.linkedin || "");
      }

      // Append profile picture if available
      if (profilePicture) {
        formDataToSend.append(
          "profile_picture",
          profilePicture,
          profilePicture.name
        );
      }

      console.log("Sending registration data:", formDataToSend);

      const actionResult = await dispatch(register(formDataToSend)).unwrap();
      console.log("Registration response:", actionResult);

      setMessage("Registration successful. Redirecting to profile...");

      // Handle profile picture upload separately if needed
      if (profilePicture && actionResult.id) {
        try {
          const pictureResponse = await uploadProfilePicture(
            profilePicture,
            actionResult.id
          );
          if (pictureResponse.status === 200) {
            setMessage("Registration and profile picture upload successful.");
          }
        } catch (pictureError) {
          console.error("Failed to upload profile picture:", pictureError);
          setMessage(
            "Registration successful, but failed to upload profile picture."
          );
        }
      }

      // Redirect to the user's profile page with the id
      navigate(`/profile/${actionResult.user_id}/`);
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <Container className="register-container mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="register-heading text-center">Register</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="register-form">
            <FormInput
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              maxLength={150}
              required
            />
            <FormInput
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              maxLength={150}
              required
            />
            <FormInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              pattern="^[\w.@+-]+$"
              maxLength={150}
              required
              title="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              maxLength={128}
              required
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={128}
              required
            />
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
            <FormInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength={100}
            />
            <FormInput
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              maxLength={200}
            />
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
                <FormInput
                  label="Facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  maxLength={200}
                />
                <FormInput
                  label="Twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  maxLength={200}
                />
                <FormInput
                  label="LinkedIn"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  maxLength={200}
                />
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
