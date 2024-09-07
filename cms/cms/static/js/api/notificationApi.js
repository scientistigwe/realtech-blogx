import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to fetch all notifications
export const fetchNotifications = async () => {
  try {
    const res = await api.get(apiEndpoints.notificationsList);
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Function to create a new notification
export const createNotification = async (data) => {
  try {
    const res = await api.post(apiEndpoints.notificationsCreate, data);
    return res.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Function to mark all notifications as read
export const markAllAsRead = async () => {
  try {
    await api.post(apiEndpoints.notificationsMarkAllAsRead);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Function to fetch a single notification by ID
export const fetchNotificationById = async (id) => {
  try {
    const res = await api.get(`${apiEndpoints.notificationsRead}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching notification by ID ${id}:`, error);
    throw error;
  }
};

// Function to update a notification
export const updateNotification = async (id, data) => {
  try {
    const res = await api.put(
      `${apiEndpoints.notificationsUpdate}/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(`Error updating notification with ID ${id}:`, error);
    throw error;
  }
};

// Function to partially update a notification
export const partialUpdateNotification = async (id, data) => {
  try {
    const res = await api.patch(
      `${apiEndpoints.notificationsPartialUpdate}/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(
      `Error partially updating notification with ID ${id}:`,
      error
    );
    throw error;
  }
};

// Function to delete a notification
export const deleteNotification = async (id) => {
  try {
    await api.delete(`${apiEndpoints.notificationsDelete}/${id}`);
  } catch (error) {
    console.error(`Error deleting notification with ID ${id}:`, error);
    throw error;
  }
};
