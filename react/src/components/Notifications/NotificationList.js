import React from "react";
import { Spinner, Alert, ListGroup } from "react-bootstrap";
import {
  useNotificationsList,
  useMarkNotificationAsRead,
} from "../../hooks/useNotification"; // Custom hook for fetching notifications

const NotificationList = () => {
  const { notifications, loading, error } = useNotificationsList();
  const [markAsRead] = useMarkNotificationAsRead();

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="notification-list">
      <h3>Notifications</h3>
      {notifications.length > 0 ? (
        <ListGroup>
          {notifications.map((notification) => (
            <ListGroup.Item
              key={notification.id}
              className={notification.is_read ? "read" : "unread"}
            >
              <div>{notification.message}</div>
              {!notification.is_read && (
                <button onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as Read
                </button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No notifications.</p>
      )}
    </div>
  );
};

export default NotificationList;
