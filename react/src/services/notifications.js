import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./../api/apiEndpoints";

console.log(`API Client (notification.js): ${apiClient}`);

/* ================================
   Private Endpoints - Authentication Required
   ================================ */

// Fetch all notifications (Private, requiresAuth: true)
export const fetchNotifications = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.notifications.list);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch notifications: " + error.message);
  }
};

// Mark a notification as read (Private, requiresAuth: true)
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.patch(
      `${apiEndpoints.notifications.update.replace(
        "<int:pk>",
        notificationId
      )}/`,
      null
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to mark notification as read: " + error.message);
  }
};

// Create a new notification (Private, requiresAuth: true)
export const createNotification = async (notificationData) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.notifications.create,
      notificationData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create notification: " + error.message);
  }
};
