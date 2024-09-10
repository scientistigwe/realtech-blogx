import notificationHandlers from "./handlers/notificationHandlers.js";
import commentHandlers from "./handlers/commentHandlers.js";
import authHandlers from "./handlers/authHandlers.js";
import postsHandlers from "./handlers/postsHandlers.js";
import categoryHandlers from "./handlers/categoryHandlers.js";
import tagHandlers from "./handlers/tagHandlers.js";
import accountHandlers from "./handlers/accountHandlers.js";
import authorHandlers from "./handlers/authorHandlers.js";
import { getElementById } from "./utils.js";

// General function to add event listeners for form submissions
const addFormListeners = (forms, handlers) => {
  Object.keys(forms).forEach((key) => {
    const form = getElementById(forms[key]);
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const handler = handlers[key];
        if (handler) {
          await handler(event);
        }
      });
    }
  });
};

// General function to add event listeners for button clicks
const addButtonListeners = (buttons, handlers) => {
  buttons.forEach(({ id, event, handler }) => {
    const button = getElementById(id);
    if (button) {
      button.addEventListener(event, async () => {
        if (handler) {
          await handler();
        }
      });
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Notification Handlers
  const notificationForms = {
    create: "create-notification-form",
    delete: "delete-notification-form",
    fetchById: "fetch-notification-form",
    partialUpdate: "partial-update-notification-form",
    update: "update-notification-form",
  };
  const notificationHandlersMap = {
    create: (event) => {
      const title = getElementValue("title");
      const message = getElementValue("message");
      return notificationHandlers.createNotification(title, message);
    },
    delete: (event) => {
      const id = getElementValue("notification-id");
      return notificationHandlers.deleteNotification(id);
    },
    fetchById: (event) => {
      const id = getElementValue("notification-id");
      return notificationHandlers.fetchNotificationById(id);
    },
    partialUpdate: (event) => {
      const id = getElementValue("notification-id");
      const title = getElementValue("title");
      const message = getElementValue("message");
      return notificationHandlers.partialUpdateNotification(id, {
        title,
        message,
      });
    },
    update: (event) => {
      const id = getElementValue("notification-id");
      const title = getElementValue("title");
      const message = getElementValue("message");
      return notificationHandlers.updateNotification(id, title, message);
    },
  };
  addFormListeners(notificationForms, notificationHandlersMap);

  // Comment Handlers
  const commentForms = {
    create: "create-comment-form",
    moderate: "moderate-comment-form",
    delete: "delete-comment-form",
    update: "update-comment-form",
    upvote: "upvote-comment-form",
    downvote: "downvote-comment-form",
  };
  const commentHandlersMap = {
    create: commentHandlers.createComment,
    moderate: commentHandlers.moderateComment,
    delete: commentHandlers.deleteComment,
    update: commentHandlers.updateComment,
    upvote: (event) => commentHandlers.voteComment(event, "upvote"),
    downvote: (event) => commentHandlers.voteComment(event, "downvote"),
  };
  addFormListeners(commentForms, commentHandlersMap);

  // Auth Handlers
  const authForms = {
    changePassword: "change-password-form",
    confirmReset: "confirm-reset-form",
    login: "loginForm",
    register: "registerForm",
    requestReset: "request-reset-form",
    updateAccount: "update-account-form",
    logout: "logout", // Assuming you have an element for logout as well
  };

  const authHandlersMap = {
    changePassword: authHandlers.useChangePassword,
    confirmReset: authHandlers.useConfirmPasswordReset,
    login: authHandlers.useCreateJwt,
    register: authHandlers.useRegister,
    requestReset: authHandlers.useRequestPasswordReset,
    updateAccount: authHandlers.useUpdateAccount,
    logout: authHandlers.useLogout, // Added logout handler
  };

  // Example function to add form listeners, adjust as needed
  function addFormListeners(forms, handlers) {
    for (const [formKey, formId] of Object.entries(forms)) {
      const formElement = document.getElementById(formId);
      if (formElement) {
        formElement.addEventListener("submit", async (event) => {
          event.preventDefault();
          const handler = handlers[formKey];
          if (handler) {
            const formData = new FormData(formElement);
            const data = Object.fromEntries(formData.entries());
            try {
              await handler(data);
              // Handle successful submission (e.g., redirect or display a message)
            } catch (error) {
              // Handle error (e.g., display an error message)
            }
          }
        });
      }
    }
  }

  // Call function to add listeners
  addFormListeners(authForms, authHandlersMap);

  // Post Handlers
  const postButtons = [
    { id: "search-form", event: "submit", handler: postsHandlers.handleSearch },
    {
      id: "create-post-form",
      event: "submit",
      handler: postsHandlers.handleCreatePost,
    },
    {
      id: "coreCategory",
      event: "change",
      handler: postsHandlers.handleCoreCategoryChange,
    },
    {
      id: "update-post-form",
      event: "submit",
      handler: postsHandlers.handleUpdatePost,
    },
    {
      id: "delete-post-btn",
      event: "click",
      handler: postsHandlers.handleDeletePost,
    },
    {
      id: "upvote-post-btn",
      event: "click",
      handler: postsHandlers.handleUpvotePost,
    },
    {
      id: "downvote-post-btn",
      event: "click",
      handler: postsHandlers.handleDownvotePost,
    },
    {
      id: "fetch-most-viewed-btn",
      event: "click",
      handler: postsHandlers.handleFetchMostViewedPosts,
    },
    {
      id: "fetch-posts-by-category-btn",
      event: "click",
      handler: postsHandlers.handleFetchPostsByCategory,
    },
    {
      id: "fetch-posts-by-subcategory-btn",
      event: "click",
      handler: postsHandlers.handleFetchPostsBySubcategory,
    },
    {
      id: "fetch-posts-by-user-btn",
      event: "click",
      handler: postsHandlers.handleFetchPostsByUser,
    },
  ];
  addButtonListeners(postButtons, {});

  // Category Handlers
  const categoryForms = {
    create: "createCategoryForm",
    delete: "deleteCategoryForm",
    update: "updateCategoryForm",
    fetchById: "fetchCategoryByIdForm",
    partialUpdate: "partialUpdateCategoryForm",
  };
  const categoryHandlersMap = {
    create: categoryHandlers.createCategory,
    delete: categoryHandlers.deleteCategory,
    update: categoryHandlers.updateCategory,
    fetchById: categoryHandlers.fetchCategoryById,
    partialUpdate: categoryHandlers.partialUpdateCategory,
  };
  addFormListeners(categoryForms, categoryHandlersMap);

  // Tag Handlers
  const tagForms = {
    create: "create-tag-form",
    delete: "delete-tag-form",
    update: "update-tag-form",
    partialUpdate: "partial-update-tag-form",
    fetch: "fetch-tag-form",
  };
  const tagHandlersMap = {
    create: tagHandlers.createTag,
    delete: tagHandlers.deleteTag,
    update: tagHandlers.updateTag,
    partialUpdate: tagHandlers.partialUpdateTag,
    fetch: tagHandlers.fetchTag,
  };
  addFormListeners(tagForms, tagHandlersMap);

  const tagButtons = [
    { id: "load-tags", event: "click", handler: tagHandlers.loadTags },
  ];
  addButtonListeners(tagButtons, {});

  // Account Handlers
  const accountForms = {
    updateAccount: "updateAccountForm",
  };
  const accountHandlersMap = {
    updateAccount: accountHandlers.updateAccount,
  };
  addFormListeners(accountForms, accountHandlersMap);

  // Author Handlers
  const authorButtons = [
    {
      id: "load-more-posts",
      event: "click",
      handler: async () => {
        const authorId = window.location.pathname.split("/").pop();
        const currentPage = 1; // Needs to be updated with actual page number
        const postsPerPage = 10; // Number of posts per page
        await authorHandlers.loadMorePosts(authorId, currentPage, postsPerPage);
      },
    },
  ];
  addButtonListeners(authorButtons, {});
});
