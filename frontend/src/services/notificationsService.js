// services/notificationService.js
import api from "../utils/api";

const handleApiError = (error, message) => {
  console.error(message, error.response?.data || error.message);
  throw error;
};

export const notificationService = {
  // Fetch all notifications
  async fetchNotifications() {
    try {
      const response = await api.notifications.list();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching notifications:");
    }
  },

  // Create a new notification
  async createNotification(data) {
    try {
      const response = await api.notifications.create(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error creating notification:");
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      await api.notifications.mark_all_as_read();
    } catch (error) {
      handleApiError(error, "Error marking all notifications as read:");
    }
  },

  // Mark a notification as read
  async markNotificationAsRead(id) {
    try {
      await api.notifications.mark_as_read(id);
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
      const response = await api.notifications.read(id);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error fetching notification by ID ${id}:`);
    }
  },

  // Update a notification by ID
  async updateNotification(id, data) {
    try {
      const response = await api.notifications.update(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error updating notification by ID ${id}:`);
    }
  },

  // Partially update a notification by ID
  async partialUpdateNotification(id, data) {
    try {
      const response = await api.notifications.partial_update(id, data);
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
      await api.notifications.delete(id);
    } catch (error) {
      handleApiError(error, `Error deleting notification by ID ${id}:`);
    }
  },
};
