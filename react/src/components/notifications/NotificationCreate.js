// components/notifications/NotificationCreate.js
import React, { useState } from "react";
import { Container, Form, Button, Alert, Breadcrumb } from "react-bootstrap";
import { notificationService } from "../../services/notificationsService";
import "../../styles/Notification.css";

const NotificationCreate = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await notificationService.createNotification({ title, message });
      setSuccess("Notification created successfully.");
      setTitle("");
      setMessage("");
    } catch (error) {
      setError("Failed to create notification.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/notifications">Notifications</Breadcrumb.Item>
        <Breadcrumb.Item active>Create Notification</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Create Notification</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="message">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Notification
        </Button>
      </Form>
    </Container>
  );
};

export default NotificationCreate;
