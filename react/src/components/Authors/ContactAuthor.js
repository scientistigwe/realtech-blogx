// src/components/ContactAuthor.js

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendContactMessage } from "../../redux/slices/authorsSlice"; // Adjust import path as needed
import {
  selectContactMessage,
  selectContactSuccess,
  selectContactError,
  selectLoading,
} from "../../redux/selectors/authorsSelectors";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ContactAuthor = () => {
  const { id } = useParams(); // Author ID from the route params
  const dispatch = useDispatch();

  // Access state using selectors
  const contactMessage = useSelector(selectContactMessage);
  const contactSuccess = useSelector(selectContactSuccess);
  const contactError = useSelector(selectContactError);
  const loading = useSelector(selectLoading);

  const [message, setMessage] = useState(contactMessage);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendContactMessage({ authorId: id, message }));
  };

  return (
    <div className="contact-author">
      <h3>Contact the Author</h3>
      {contactSuccess && <Alert variant="success">{contactSuccess}</Alert>}
      {contactError && <Alert variant="danger">{contactError}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Your Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={handleMessageChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </Form>
    </div>
  );
};

export default ContactAuthor;
