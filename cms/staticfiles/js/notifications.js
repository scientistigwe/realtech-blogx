// notificationHandlers.js
const notificationHandlers = {
  async createNotification(title, message) {
    try {
      utils.displayLoading();
      await api.notifications.create({ title, message });
      utils.displaySuccess("Notification created successfully!");
    } catch (error) {
      utils.displayError("Error creating notification: " + error.message);
    }
  },

  async deleteNotification(id) {
    try {
      utils.displayLoading();
      await api.notifications.delete(id);
      utils.displaySuccess("Notification deleted successfully!");
    } catch (error) {
      utils.displayError("Error deleting notification: " + error.message);
    }
  },

  async fetchNotificationById(id) {
    try {
      utils.displayLoading();
      const response = await api.notifications.fetchById(id);
      const notification = response.data;
      const detailDiv = document.getElementById("notification-detail");
      detailDiv.innerHTML = `
        <h2>${notification.title}</h2>
        <p>${notification.message}</p>
      `;
    } catch (error) {
      utils.displayError("Error fetching notification by ID: " + error.message);
    }
  },

  async markAllAsRead() {
    try {
      utils.displayLoading();
      await api.notifications.markAllAsRead();
      utils.displaySuccess("All notifications marked as read!");
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError("Error marking all as read: " + error.message);
    }
  },

  async fetchNotifications() {
    try {
      utils.displayLoading();
      const response = await api.notifications.fetchAll();
      const notifications = response.data;
      this.renderNotifications(notifications);
    } catch (error) {
      utils.displayError("Error fetching notifications: " + error.message);
    }
  },

  renderNotifications(notifications) {
    const container = document.getElementById("notifications-container");
    container.innerHTML = notifications
      .map(
        (notification) => `
      <div class="p-4 ${
        notification.is_read ? "bg-gray-100" : "bg-blue-100"
      } rounded-lg">
        <p class="mb-2">${notification.content}</p>
        <div class="text-sm text-gray-600">
          ${new Date(notification.created_at).toLocaleString()}
          ${
            !notification.is_read
              ? `
            <button class="ml-2 text-blue-500 hover:underline mark-read" data-id="${notification.id}">
              Mark as read
            </button>
          `
              : ""
          }
        </div>
      </div>
    `
      )
      .join("");

    document.querySelectorAll(".mark-read").forEach((button) => {
      button.addEventListener("click", () =>
        this.markAsRead(button.dataset.id)
      );
    });
  },

  async markAsRead(notificationId) {
    try {
      await api.notifications.markAsRead(notificationId);
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError(
        "Error marking notification as read: " + error.message
      );
    }
  },

  async updateNotification(id, title, message) {
    try {
      utils.displayLoading();
      await api.notifications.update(id, { title, message });
      utils.displaySuccess("Notification updated successfully!");
    } catch (error) {
      utils.displayError("Error updating notification: " + error.message);
    }
  },

  async partialUpdateNotification(id, data) {
    try {
      utils.displayLoading();
      await api.notifications.partialUpdate(id, data);
      utils.displaySuccess("Notification partially updated successfully!");
    } catch (error) {
      utils.displayError(
        "Error partially updating notification: " + error.message
      );
    }
  },
};

// main.js
document.addEventListener("DOMContentLoaded", () => {
  // Create notification
  document
    .getElementById("create-notification-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const message = document.getElementById("message").value;
      await notificationHandlers.createNotification(title, message);
    });

  // Delete notification
  document
    .getElementById("delete-notification-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = document.getElementById("notification-id").value;
      await notificationHandlers.deleteNotification(id);
    });

  // Fetch notification by ID
  document
    .getElementById("fetch-notification-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = document.getElementById("notification-id").value;
      await notificationHandlers.fetchNotificationById(id);
    });

  // Mark all as read
  document
    .getElementById("mark-all-as-read")
    .addEventListener("click", () => notificationHandlers.markAllAsRead());

  // Fetch all notifications
  document
    .getElementById("fetch-notifications")
    .addEventListener("click", () => notificationHandlers.fetchNotifications());

  // Partial update notification
  document
    .getElementById("partial-update-notification-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = document.getElementById("notification-id").value;
      const title = document.getElementById("title").value;
      const message = document.getElementById("message").value;
      await notificationHandlers.partialUpdateNotification(id, {
        title,
        message,
      });
    });

  // Update notification
  document
    .getElementById("update-notification-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = document.getElementById("notification-id").value;
      const title = document.getElementById("title").value;
      const message = document.getElementById("message").value;
      await notificationHandlers.updateNotification(id, title, message);
    });

  // Initial fetch of notifications
  notificationHandlers.fetchNotifications();
});
