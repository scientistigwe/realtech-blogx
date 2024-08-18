import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../slices/notificationsSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  if (loading)
    return <div className="text-center mt-4">Loading notifications...</div>;

  return (
    <div className="container mt-4 notifications">
      <h1 className="mb-4">Notifications</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`list-group-item ${notification.read ? "read" : ""}`}
              role="listitem"
            >
              <p>{notification.message}</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleMarkAsRead(notification.id)}
                disabled={notification.read}
                aria-label={`Mark notification ${notification.id} as read`}
              >
                {notification.read ? "Read" : "Mark as Read"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
