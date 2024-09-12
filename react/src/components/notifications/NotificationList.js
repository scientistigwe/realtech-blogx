// components/notifications/NotificationList.js
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Breadcrumb, Alert } from "react-bootstrap";
import { notificationService } from "../../services/notificationsService";
import "../../styles/Notification.css";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.fetchNotifications();
        setNotifications(data);
      } catch (error) {
        setError("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      setError("Failed to mark all as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      setError("Failed to delete notification.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Notifications</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Notifications</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" onClick={handleMarkAllAsRead}>
        Mark All as Read
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{notification.title}</td>
              <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
              <td>{notification.isRead ? "Read" : "Unread"}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(notification.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default NotificationList;
