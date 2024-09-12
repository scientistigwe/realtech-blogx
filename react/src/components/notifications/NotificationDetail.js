// components/notifications/NotificationDetail.js
import React, { useEffect, useState } from "react";
import { Container, Breadcrumb, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationsService";
import "../../styles/Notification.css";

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

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

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markNotificationAsRead(id);
      setNotification({ ...notification, isRead: true });
    } catch (error) {
      setError("Failed to mark notification as read.");
    }
  };

  const handleDelete = async () => {
    try {
      await notificationService.deleteNotification(id);
      navigate("/notifications");
    } catch (error) {
      setError("Failed to delete notification.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/notifications">Notifications</Breadcrumb.Item>
        <Breadcrumb.Item active>Notification Detail</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Notification Detail</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {notification ? (
        <div>
          <h2>{notification.title}</h2>
          <p>{notification.message}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {notification.isRead ? "Read" : "Unread"}
          </p>
          {!notification.isRead && (
            <Button variant="success" onClick={handleMarkAsRead}>
              Mark as Read
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete} className="ml-2">
            Delete
          </Button>
        </div>
      ) : (
        <Alert variant="info">Loading...</Alert>
      )}
    </Container>
  );
};

export default NotificationDetail;
