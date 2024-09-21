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
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import {
  validatePassword,
  validatePasswordConfirmation,
} from "../../utils/validations";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate new password
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    // Validate password confirmation
    if (!validatePasswordConfirmation(newPassword, reNewPassword)) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await authService.confirmResetPassword({
        new_password: newPassword,
        re_new_password: reNewPassword,
        uid,
        token,
      });
      setSuccessMessage("Password has been successfully reset.");
      setError(null); // Clear any previous errors
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (error) {
      setError("Failed to reset password.");
      setSuccessMessage(""); // Clear any previous success messages
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
          <h2 className="text-center mb-4">Confirm Password Reset</h2>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetConfirm;
