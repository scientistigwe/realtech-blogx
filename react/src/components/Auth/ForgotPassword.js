import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks/useAuth"; // Correct import

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { requestPasswordReset, loading, message, error } = useResetPassword(); // Use the hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      navigate("/"); // Redirect or show success message
    } catch (err) {
      console.error("Password reset request error:", err);
    }
  };

  return (
    <Container className="forgot-password-container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="forgot-password-heading text-center">
            Forgot Password
          </h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
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
              className="w-100"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Processing..." : "Request Password Reset"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
