import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../../redux/slices/authSlice";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Breadcrumb,
} from "react-bootstrap";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

// Selectors
import {
  selectAuthLoading,
  selectAuthError,
} from "../../redux/selectors/authSelectors";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use selectors to access loading and error states
  const loading = useSelector(selectAuthLoading);
  const reduxError = useSelector(selectAuthError);

  useEffect(() => {
    // Clear error on component mount or update
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clear any previous errors
      setError("");

      // Dispatch the login action to the authSlice
      // This action will handle the login process
      // `unwrap()` is used to get the result directly or throw an error
      const userData = await dispatch(login(credentials)).unwrap();

      // Log the ID to the console
      console.log("Request dispatched to authSlice.js");
      console.log("User ID:", userData.user_id);
      console.log("User Data:", userData);

      // Redirect on successful login
      navigate(`/profile/${userData.user_id}/`);
    } catch (err) {
      // Handle error if login fails
      setError(err.message || "Login failed. Please check your credentials.");
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
          {(error || reduxError) && (
            <Alert variant="danger">{error || reduxError}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {["username", "password"].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={credentials[field]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
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
