import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";

const initialFormData = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  password2: "",
  bio: "",
  website: "",
  location: "",
  social_profiles: {},
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isAuthor, setIsAuthor] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { register, loading, message, error } = useRegister();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      password2,
      website,
      location,
      social_profiles,
    } = formData;

    // Validation rules (unchanged)
    if (first_name.length > 150)
      newErrors.first_name = "First name must be 150 characters or fewer";
    if (last_name.length > 150)
      newErrors.last_name = "Last name must be 150 characters or fewer";

    const usernameRegex = /^[\w.@+\-]+$/;
    if (
      !usernameRegex.test(username) ||
      username.length > 150 ||
      username.length < 1
    ) {
      newErrors.username =
        "Username must be 1-150 characters. Only letters, digits, and @/./+/-/_ are allowed.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 254) {
      newErrors.email = "Enter a valid email address (max 254 characters)";
    }

    if (password.length < 8 || password.length > 128) {
      newErrors.password = "Password must be between 8 and 128 characters.";
    } else {
      const passwordRules = [/[a-z]/, /[A-Z]/, /[0-9]/, /[@$!%*?&]/];
      if (!passwordRules.every((rule) => rule.test(password))) {
        newErrors.password =
          "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character.";
      }
    }

    if (password !== password2) newErrors.password2 = "Passwords do not match";
    if (website && website.length > 200)
      newErrors.website = "Website URL must be 200 characters or fewer";
    if (location && location.length > 100)
      newErrors.location = "Location must be 100 characters or fewer";

    if (isAuthor && Object.keys(social_profiles).length === 0) {
      newErrors.social_profiles =
        "At least one social media profile is required for authors.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSocialProfileChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      social_profiles: {
        ...prev.social_profiles,
        [platform]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, social_profiles: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (validateForm()) {
      try {
        console.log("Submitting registration data:", formData);
        const data = await register(formData, isAuthor);

        console.log("Registration response:", data);

        if (data && data.user_id) {
          setSuccessMessage(
            "Registration successful! Redirecting to your profile..."
          );
          setTimeout(() => navigate(`/profile/${data.user_id}/`), 3000);
        } else {
          setErrors({
            general:
              "Registration was successful, but user ID was not received.",
          });
        }
      } catch (err) {
        console.error("Registration error:", err);
        setErrors({
          general: "Registration failed. Please try again.",
          details:
            err.response?.data || err.message || "Unknown error occurred",
        });
      }
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <Container className="register-container mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="register-heading text-center">Register</h2>
          {message && <Alert variant="info">{message}</Alert>}
          {error && (
            <Alert variant="danger">
              {error.message || "An error occurred"}
            </Alert>
          )}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errors.general && <Alert variant="danger">{errors.general}</Alert>}
          {errors.details && (
            <Alert variant="danger">
              <pre>{JSON.stringify(errors.details, null, 2)}</pre>
            </Alert>
          )}
          <Form onSubmit={handleSubmit} className="register-form">
            <FormField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              maxLength={150}
              required
              error={errors.first_name}
            />
            <FormField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              maxLength={150}
              required
              error={errors.last_name}
            />
            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              pattern="^[\w.@+\-]+$"
              maxLength={150}
              required
              error={errors.username}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
              required
              error={errors.email}
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              maxLength={128}
              required
              error={errors.password}
            />
            <FormField
              label="Confirm Password"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              maxLength={128}
              required
              error={errors.password2}
            />
            <FormField
              label="Bio"
              name="bio"
              as="textarea"
              rows={5}
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              error={errors.bio}
            />
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength={100}
              error={errors.location}
            />
            <FormField
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              maxLength={200}
              error={errors.website}
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
              <>
                <h4>Social Profiles</h4>
                <SocialProfileFields
                  socialProfiles={formData.social_profiles}
                  onChange={handleSocialProfileChange}
                  error={errors.social_profiles}
                />
              </>
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

const FormField = ({
  label,
  name,
  type = "text",
  as,
  rows,
  value,
  onChange,
  maxLength,
  required,
  error,
  pattern,
}) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      as={as}
      rows={rows}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      required={required}
      isInvalid={!!error}
      pattern={pattern}
    />
    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
  </Form.Group>
);

const SocialProfileFields = ({ socialProfiles, onChange, error }) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Twitter</Form.Label>
      <Form.Control
        type="url"
        value={socialProfiles.twitter || ""}
        onChange={(e) => onChange("twitter", e.target.value)}
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>LinkedIn</Form.Label>
      <Form.Control
        type="url"
        value={socialProfiles.linkedin || ""}
        onChange={(e) => onChange("linkedin", e.target.value)}
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>GitHub</Form.Label>
      <Form.Control
        type="url"
        value={socialProfiles.github || ""}
        onChange={(e) => onChange("github", e.target.value)}
      />
    </Form.Group>
    {error && <Alert variant="danger">{error}</Alert>}
  </>
);

export default Register;
