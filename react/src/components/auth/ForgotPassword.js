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
import { useAuth } from "../../hooks/useAuth";
import { validateEmail } from "../../utils/validations";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { resetPassword, loading, error } = useAuth(); // Use the hook here

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setFormError("Invalid email format.");
      return;
    }

    setFormError(null);

    try {
      await resetPassword({ email });
      setSuccessMessage("Password reset link has been sent to your email.");
    } catch (err) {
      setFormError(
        error || "Failed to send password reset link. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Forgot Password</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Forgot Password</h2>
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

export default ForgotPassword;
