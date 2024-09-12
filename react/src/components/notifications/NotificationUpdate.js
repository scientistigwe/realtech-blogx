// components/notifications/NotificationUpdate.js
import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Breadcrumb } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationsService";
import "../../styles/Notification.css";

const NotificationUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await notificationService.getNotificationById(id);
        setNotification(data);
      } catch (error) {
        setError("Failed to fetch notification.");
      }
    };

    fetchNotification();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await notificationService.updateNotification(id, notification);
      setSuccess("Notification updated successfully.");
    } catch (error) {
      setError("Failed to update notification.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/notifications">Notifications</Breadcrumb.Item>
        <Breadcrumb.Item active>Update Notification</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Update Notification</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {notification ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notification.message}
              onChange={(e) =>
                setNotification({ ...notification, message: e.target.value })
              }
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Notification
          </Button>
        </Form>
      ) : (
        <Alert variant="info">Loading...</Alert>
      )}
    </Container>
  );
};

export default NotificationUpdate;
