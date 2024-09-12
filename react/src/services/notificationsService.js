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

export const notificationService = {
  // Fetch all notifications
  async fetchNotifications() {
    try {
      const response = await apiListNotifications();
      return response.data; // Assuming the response contains the list of notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Create a new notification
  async createNotification(data) {
    try {
      const response = await apiCreateNotification(data);
      return response.data; // Assuming the response contains the created notification data
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      await apiMarkAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markNotificationAsRead(id) {
    try {
      await apiMarkNotificationAsRead(id);
    } catch (error) {
      console.error(
        `Error marking notification with id: ${id} as read: ${error}`
      );
      throw error;
    }
  },

  // Fetch a single notification by ID
  async getNotificationById(id) {
    try {
      const response = await apiGetNotificationById(id);
      return response.data; // Assuming the response contains the notification data
    } catch (error) {
      console.error("Error fetching notification by ID:", error);
      throw error;
    }
  },

  // Update a notification by ID
  async updateNotification(id, data) {
    try {
      const response = await apiUpdateNotification(id, data);
      return response.data; // Assuming the response contains the updated notification data
    } catch (error) {
      console.error("Error updating notification by ID:", error);
      throw error;
    }
  },

  // Partially update a notification by ID
  async partialUpdateNotification(id, data) {
    try {
      const response = await apiPartialUpdateNotification(id, data);
      return response.data; // Assuming the response contains the partially updated notification data
    } catch (error) {
      console.error("Error partially updating notification by ID:", error);
      throw error;
    }
  },

  // Delete a notification by ID
  async deleteNotification(id) {
    try {
      await apiDeleteNotification(id);
    } catch (error) {
      console.error("Error deleting notification by ID:", error);
      throw error;
    }
  },
};
