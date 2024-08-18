import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage } from "./../redux/slices/authorsSlice"; // Adjust import path as needed
import { selectAllAuthors } from "./../redux/selectors/authorsSelectors"; // Adjust import path as needed
import { Spinner, Button, Form, Alert } from "react-bootstrap";

const ContactAuthor = () => {
  const dispatch = useDispatch();
  const author = useSelector((state) => selectAllAuthors(state /* authorId */)); // Replace with appropriate ID or state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await dispatch(
        sendContactMessage({ authorId: author.id, ...contactForm })
      );
      setSuccess("Your message has been sent.");
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-author">
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={contactForm.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={contactForm.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="message"
            value={contactForm.message}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Message
        </Button>
      </Form>
    </div>
  );
};

export default ContactAuthor;
