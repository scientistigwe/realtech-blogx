import { useState } from "react";
import api from "../api/api"; // Adjust the path according to your project structure

// Hook to manage notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.notifications.list();
      setNotifications(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new notification
  const createNotification = async (data) => {
    setLoading(true);
    try {
      const res = await api.notifications.create(data);
      setNotifications((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await api.notifications.markAsRead();
      // Update state after marking all as read
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single notification by ID
  const fetchNotificationById = async (id) => {
    setLoading(true);
    try {
      const res = await api.notifications.read(id);
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a notification
  const updateNotification = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.notifications.update(id, data);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? res.data : notif))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to partially update a notification
  const partialUpdateNotification = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.notifications.partialUpdate(id, data);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? res.data : notif))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a notification
  const deleteNotification = async (id) => {
    setLoading(true);
    try {
      await api.notifications.delete(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    error,
    loading,
    fetchNotifications,
    createNotification,
    markAllAsRead,
    fetchNotificationById,
    updateNotification,
    partialUpdateNotification,
    deleteNotification,
  };
};
