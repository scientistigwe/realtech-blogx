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

const Register = () => {
  const navigate = useNavigate();
  const { createUser: register, createJwt: login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { username, email, password, confirmPassword } = formData;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setFormError("All fields are required.");
      return;
    }

    try {
      await register({
        username,
        email,
        password,
        re_password: confirmPassword,
      });

      const loginResult = await login(username, password);
      if (loginResult.detail === "Login successful") {
        setFormError(null);
        navigate("/dashboard");
      } else {
        throw new Error("Login failed after registration");
      }
    } catch (err) {
      setFormError(err.message || "Failed to register. Please try again.");
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
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </Form.Group>

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
