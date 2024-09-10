import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";

// Notification Handlers
const notificationHandlers = {
  async createNotification(title, message) {
    try {
      utils.displayLoading();
      await api.post(apiEndpoints.notificationsCreate, { title, message });
      utils.displaySuccess("Notification created successfully!");
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError("Error creating notification: " + error.message);
    } finally {
      utils.hideLoading();
    }
  },

  async deleteNotification(id) {
    try {
      utils.displayLoading();
      await api.delete(apiEndpoints.notificationsDelete(id));
      utils.displaySuccess("Notification deleted successfully!");
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError("Error deleting notification: " + error.message);
    } finally {
      utils.hideLoading();
    }
  },

  async fetchNotificationById(id) {
    try {
      utils.displayLoading();
      const response = await api.get(apiEndpoints.notificationsRead(id));
      const notification = response.data;
      const detailDiv = document.getElementById("notification-detail");
      if (detailDiv) {
        detailDiv.innerHTML = `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
        `;
      }
    } catch (error) {
      utils.displayError("Error fetching notification by ID: " + error.message);
    } finally {
      utils.hideLoading();
    }
  },

  async markAllAsRead() {
    try {
      utils.displayLoading();
      await api.post(apiEndpoints.notificationsMarkAllAsRead);
      utils.displaySuccess("All notifications marked as read!");
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError("Error marking all as read: " + error.message);
    } finally {
      utils.hideLoading();
    }
  },

  async fetchNotifications() {
    try {
      utils.displayLoading();
      const response = await api.get(apiEndpoints.notificationsList);
      const notifications = response.data;
      this.renderNotifications(notifications);
    } catch (error) {
      utils.displayError("Error fetching notifications: " + error.message);
    } finally {
      utils.hideLoading();
    }
  },

  renderNotifications(notifications) {
    const container = document.getElementById("notifications-container");
    if (container) {
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
    }
  },

  async markAsRead(notificationId) {
    try {
      await api.post(apiEndpoints.notificationsMarkAsRead(notificationId));
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
      await api.put(apiEndpoints.notificationsUpdate(id), { title, message });
      utils.displaySuccess("Notification updated successfully!");
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError("Error updating notification: " + error.message);
    } finally {
      utils.hideLoading();
    }
  },

  async partialUpdateNotification(id, data) {
    try {
      utils.displayLoading();
      await api.patch(apiEndpoints.notificationsPartialUpdate(id), data);
      utils.displaySuccess("Notification partially updated successfully!");
      await this.fetchNotifications(); // Refresh the list
    } catch (error) {
      utils.displayError(
        "Error partially updating notification: " + error.message
      );
    } finally {
      utils.hideLoading();
    }
  },

  // Safely adds listeners for notification actions
  addNotificationListeners() {
    const createForm = document.getElementById("create-notification-form");
    if (createForm) {
      createForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const message = document.getElementById("message").value;
        await this.createNotification(title, message);
      });
    }

    const deleteForm = document.getElementById("delete-notification-form");
    if (deleteForm) {
      deleteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = document.getElementById("notification-id").value;
        await this.deleteNotification(id);
      });
    }

    const markAllReadButton = document.getElementById("mark-all-read");
    if (markAllReadButton) {
      markAllReadButton.addEventListener("click", async () => {
        await this.markAllAsRead();
      });
    }
  },
};

// Export the handlers if needed
export default notificationHandlers;
