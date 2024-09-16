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
import { validateEmail } from "../../utils/validations";
import { useAuth } from "../../hooks/useAuth"; // Import the custom hook
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { resetPassword, loading, error } = useAuth(); // Use the custom hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setFormError("Invalid email format.");
      return;
    }

    try {
      await resetPassword({ email }); // Call the hook function
      setSuccessMessage("Password reset link has been sent to your email.");
      setFormError(null);
      // Redirect to login or another page
      navigate("/login");
    } catch (err) {
      setFormError(error || "Failed to send password reset link."); // Use the error from the hook
      setSuccessMessage("");
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/login">Login</Breadcrumb.Item>
        <Breadcrumb.Item active>Reset Password</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Reset Password</h2>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Sending..." : "Send Password Reset Link"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;
