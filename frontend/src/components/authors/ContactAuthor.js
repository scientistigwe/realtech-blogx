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
import { useParams } from "react-router-dom";
import { useContactAuthor } from "../../hooks/useAuthors";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const ContactAuthor = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { contactAuthor, response, loading, error } = useContactAuthor();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = { title, name, email, message };

    try {
      await contactAuthor(id, contactData);
      setTitle("");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      // error is handled by the hook
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/authors">Authors</Breadcrumb.Item>
        <Breadcrumb.Item active>Contact Author</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Contact Author</h2>
          {error && <Alert variant="danger">{error.message}</Alert>}
          {response && (
            <Alert variant="success">
              Your message has been sent successfully!
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactAuthor;
