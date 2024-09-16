import { useState, useCallback } from "react";
import { notificationService } from "../services/notificationService"; // Adjust the path as necessary

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeNotificationOperation = useCallback(
    async (operation, ...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await operation(...args);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchNotifications = useCallback(
    () => executeNotificationOperation(notificationService.fetchNotifications),
    [executeNotificationOperation]
  );
  const createNotification = useCallback(
    (data) =>
      executeNotificationOperation(
        notificationService.createNotification,
        data
      ),
    [executeNotificationOperation]
  );
  const markAllAsRead = useCallback(
    () => executeNotificationOperation(notificationService.markAllAsRead),
    [executeNotificationOperation]
  );
  const markNotificationAsRead = useCallback(
    (id) =>
      executeNotificationOperation(
        notificationService.markNotificationAsRead,
        id
      ),
    [executeNotificationOperation]
  );
  const getNotificationById = useCallback(
    (id) =>
      executeNotificationOperation(notificationService.getNotificationById, id),
    [executeNotificationOperation]
  );
  const updateNotification = useCallback(
    (id, data) =>
      executeNotificationOperation(
        notificationService.updateNotification,
        id,
        data
      ),
    [executeNotificationOperation]
  );
  const partialUpdateNotification = useCallback(
    (id, data) =>
      executeNotificationOperation(
        notificationService.partialUpdateNotification,
        id,
        data
      ),
    [executeNotificationOperation]
  );
  const deleteNotification = useCallback(
    (id) =>
      executeNotificationOperation(notificationService.deleteNotification, id),
    [executeNotificationOperation]
  );

  return {
    fetchNotifications,
    createNotification,
    markAllAsRead,
    markNotificationAsRead,
    getNotificationById,
    updateNotification,
    partialUpdateNotification,
    deleteNotification,
    loading,
    error,
  };
};
