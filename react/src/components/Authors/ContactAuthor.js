import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import api from "./../../api/apiClient"; // Adjust the path if needed

const ContactAuthor = () => {
  const { id } = useParams(); // Author ID from route params
  const [contactForm, setContactForm] = useState({
    title: "",
    name: "",
    email: "",
    message: "",
  });
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setContactSuccess("");
    setContactError("");

    try {
      // Send contact message using API
      await api.authors.contactAuthor(id, contactForm);
      setContactSuccess("Message sent successfully!");
      setContactForm({
        title: "",
        name: "",
        email: "",
        message: "",
      }); // Clear the form after successful submission
    } catch (error) {
      setContactError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-author">
      <h3>Contact the Author</h3>
      {contactSuccess && <Alert variant="success">{contactSuccess}</Alert>}
      {contactError && <Alert variant="danger">{contactError}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={contactForm.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={contactForm.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Your Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={contactForm.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Your Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="message"
            value={contactForm.message}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
        {loading && (
          <div className="text-center mt-2">
            <Spinner animation="border" />
          </div>
        )}
      </Form>
    </div>
  );
};

export default ContactAuthor;
