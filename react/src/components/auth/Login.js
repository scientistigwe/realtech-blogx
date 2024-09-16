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
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const Login = () => {
  const navigate = useNavigate();
  const { createJwt, loading, error } = useAuth(); // Ensure useAuth provides createJwt
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formError, setFormError] = useState(null);

  // Handle change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the appropriate field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { username, password } = formData;

    // Basic validation
    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }

    try {
      // Call `createJwt` with username and password as separate arguments
      const result = await createJwt(username, password);
      if (result.message === "Login successful") {
        // Redirect to dashboard or home page
        navigate(`/profile`);
      } else {
        setFormError("Login failed. Please try again.");
      }
    } catch (error) {
      setFormError(error.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Login</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Login</h2>

          {/* Form errors or server errors */}
          {formError && <Alert variant="danger">{formError}</Alert>}
          {error && !formError && (
            <Alert variant="danger">An error occurred. Please try again.</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username} // Controlled input
                onChange={handleChange} // Use handleChange function
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password} // Controlled input
                onChange={handleChange} // Use handleChange function
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
