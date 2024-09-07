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
import { useNavigate } from "react-router-dom";
import { useCreateJwt } from "../../hooks/useAuth";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const Login = () => {
  const { login, loading, error } = useCreateJwt(); // Ensure useCreateJwt is correctly imported and used
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      console.log("Attempting login...");
      const { user_id } = await login({ username, password }); // Ensure login function is called correctly
      console.log("Login successful");
      if (user_id) {
        navigate(`/profile/${user_id}/`);
      }
    } catch (err) {
      console.error(err);
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
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" required />
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
