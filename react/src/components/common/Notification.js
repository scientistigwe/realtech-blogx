import React from "react";
import { useNotifications } from "../hooks/useNotification"; // Adjust path if necessary

const Notification = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification-item ${notification.read ? "read" : ""}`}
            >
              <p>{notification.message}</p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)}>
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
