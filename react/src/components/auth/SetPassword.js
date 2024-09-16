import React from "react";
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
import { useAuth } from "../../hooks/useAuth";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";
import { validatePassword } from "../../utils/validations";

const SetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { setPassword, loading, error } = useAuth(); // Use the existing hook
  const [newPassword, setNewPassword] = React.useState("");
  const [formError, setFormError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setFormError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await setPassword({ new_password: newPassword, uid, token });
      setSuccessMessage("Password has been successfully set.");
      setFormError(null);
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      setFormError("Failed to set password.");
      setSuccessMessage("");
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Set Password</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Set Password</h2>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {formError && <Alert variant="danger">{formError}</Alert>}
          {error && (
            <Alert variant="danger">An error occurred. Please try again.</Alert>
          )}
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
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SetPassword;
