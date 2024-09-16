import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../../utils/validations";

const Register = () => {
  const navigate = useNavigate();
  const { createUser: register, createJwt: login, loading, error } = useAuth();

  // State for form data and form error messages
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Validating the form inputs
    if (!validateUsername(username)) {
      setFormError("Username must be between 3 and 150 characters.");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("Invalid email format.");
      return;
    }
    if (!validatePassword(password)) {
      setFormError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    // If validations pass, try to register and log in the user
    try {
      console.log("Attempting to register user...");
      await register({
        username,
        email,
        password,
        re_password: confirmPassword,
      });
      console.log("User registered successfully");

      console.log("Attempting to log in...");
      const loginResult = await login(username, password);
      console.log("Login result:", loginResult);

      if (loginResult.detail === "Login successful") {
        setSuccessMessage("Registration successful. You are now logged in.");
        setFormError(null);

        // Navigate to user profile after successful registration and login
        console.log(`Navigating to /profile/${username} in 3 seconds...`);
        setTimeout(() => {
          console.log("Executing navigation now");
          navigate(`/profile/${username}`);
        }, 3000);
      } else {
        throw new Error("Login failed after registration");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setFormError(err.message || "Failed to register. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Register</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Register</h2>
          {/* Display success or error messages */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {formError && <Alert variant="danger">{formError}</Alert>}
          {error && !formError && (
            <Alert variant="danger">An error occurred. Please try again.</Alert>
          )}

          {/* Registration form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </Form.Group>

            {/* Register button */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100"
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
