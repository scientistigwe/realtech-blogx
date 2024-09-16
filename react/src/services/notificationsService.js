// services/notificationService.js
import {
  listNotifications as apiListNotifications,
  createNotification as apiCreateNotification,
  markMultipleAsRead as apiMarkAllAsRead,
  markNotificationAsRead as apiMarkNotificationAsRead,
  getNotificationById as apiGetNotificationById,
  updateNotification as apiUpdateNotification,
  partialUpdateNotification as apiPartialUpdateNotification,
  deleteNotification as apiDeleteNotification,
} from "../utils/api"; // Adjust the path as necessary

const handleApiError = (error, message) => {
  console.error(message, error.response?.data || error.message);
  throw error;
};

export const notificationService = {
  // Fetch all notifications
  async fetchNotifications() {
    try {
      const response = await apiListNotifications();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching notifications:");
    }
  },

  // Create a new notification
  async createNotification(data) {
    try {
      const response = await apiCreateNotification(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error creating notification:");
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      await apiMarkAllAsRead();
    } catch (error) {
      handleApiError(error, "Error marking all notifications as read:");
    }
  },

  // Mark a notification as read
  async markNotificationAsRead(id) {
    try {
      await apiMarkNotificationAsRead(id);
    } catch (error) {
      handleApiError(
        error,
        `Error marking notification with id: ${id} as read:`
      );
    }
  },

  // Fetch a single notification by ID
  async getNotificationById(id) {
    try {
      const response = await apiGetNotificationById(id);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error fetching notification by ID ${id}:`);
    }
  },

  // Update a notification by ID
  async updateNotification(id, data) {
    try {
      const response = await apiUpdateNotification(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error updating notification by ID ${id}:`);
    }
  },

  // Partially update a notification by ID
  async partialUpdateNotification(id, data) {
    try {
      const response = await apiPartialUpdateNotification(id, data);
      return response.data;
    } catch (error) {
      handleApiError(
        error,
        `Error partially updating notification by ID ${id}:`
      );
    }
  },

  // Delete a notification by ID
  async deleteNotification(id) {
    try {
      await apiDeleteNotification(id);
    } catch (error) {
      handleApiError(error, `Error deleting notification by ID ${id}:`);
    }
  },
};
