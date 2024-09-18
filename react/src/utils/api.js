import { apiEndpoints } from "./apiEndpoints"; // Adjust the import path as necessary
import { apiRequest } from "./apiRequest"; // Adjust the import path as necessary

// Check Auth API function
export const checkAuth = () => apiRequest("GET", apiEndpoints.api.checkAuth);

// Auth API functions
export const createJwt = (data) =>
  apiRequest("POST", apiEndpoints.auth.jwtCreate, data);
export const refreshJwt = (data) =>
  apiRequest("POST", apiEndpoints.auth.jwtRefresh, data);
export const verifyJwt = (data) =>
  apiRequest("POST", apiEndpoints.auth.jwtVerify, data);
export const createUser = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersCreate, data);
export const logout = (data) =>
  apiRequest("POST", apiEndpoints.auth.logout, data);
export const getUsersList = () =>
  apiRequest("GET", apiEndpoints.auth.usersList);
export const activateUser = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersActivation, data);
export const getUserProfile = () =>
  apiRequest("GET", apiEndpoints.auth.usersMeRead);
export const updateUserProfile = (data) =>
  apiRequest("PUT", apiEndpoints.auth.usersMeUpdate, data);
export const partialUpdateUserProfile = (data) =>
  apiRequest("PATCH", apiEndpoints.auth.usersMePartialUpdate, data);
export const deleteUserProfile = () =>
  apiRequest("DELETE", apiEndpoints.auth.usersMeDelete);
export const resendActivation = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersResendActivation, data);
export const resetPassword = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersResetPassword, data);
export const confirmResetPassword = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersResetPasswordConfirm, data);
export const resetUsername = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersResetUsername, data);
export const confirmResetUsername = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersResetUsernameConfirm, data);
export const setPassword = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersSetPassword, data);
export const setUsername = (data) =>
  apiRequest("POST", apiEndpoints.auth.usersSetUsername, data);
export const getUserProfileById = (id) =>
  apiRequest("GET", apiEndpoints.auth.usersRead(id));
export const updateUserById = (id, data) =>
  apiRequest("PUT", apiEndpoints.auth.usersUpdate(id), data);
export const partialUpdateUserById = (id, data) =>
  apiRequest("PATCH", apiEndpoints.auth.usersPartialUpdate(id), data);
export const deleteUserById = (id) =>
  apiRequest("DELETE", apiEndpoints.auth.usersDelete(id));

// Categories API functions
export const listCategories = () =>
  apiRequest("GET", apiEndpoints.categories.list);
export const createCategory = (data) =>
  apiRequest("POST", apiEndpoints.categories.create, data);
export const getCategoryById = (id) =>
  apiRequest("GET", apiEndpoints.categories.read(id));
export const updateCategory = (id, data) =>
  apiRequest("PUT", apiEndpoints.categories.update(id), data);
export const partialUpdateCategory = (id, data) =>
  apiRequest("PATCH", apiEndpoints.categories.partialUpdate(id), data);
export const deleteCategory = (id) =>
  apiRequest("DELETE", apiEndpoints.categories.delete(id));

// Comments API functions
export const listComments = () => apiRequest("GET", apiEndpoints.comments.list);
export const createComment = (data) =>
  apiRequest("POST", apiEndpoints.comments.create, data);
export const getCommentById = (id) =>
  apiRequest("GET", apiEndpoints.comments.read(id));
export const updateComment = (id, data) =>
  apiRequest("PUT", apiEndpoints.comments.update(id), data);
export const partialUpdateComment = (id, data) =>
  apiRequest("PATCH", apiEndpoints.comments.partialUpdate(id), data);
export const deleteComment = (id) =>
  apiRequest("DELETE", apiEndpoints.comments.delete(id));
export const downvoteComment = (id) =>
  apiRequest("POST", apiEndpoints.comments.downvote(id));
export const moderateComment = (id) =>
  apiRequest("POST", apiEndpoints.comments.moderate(id));
export const upvoteComment = (id) =>
  apiRequest("POST", apiEndpoints.comments.upvote(id));

// Notifications API functions
export const listNotifications = () =>
  apiRequest("GET", apiEndpoints.notifications.list);
export const createNotification = (data) =>
  apiRequest("POST", apiEndpoints.notifications.create, data);
export const markMultipleAsRead = (data) =>
  apiRequest("POST", apiEndpoints.notifications.markMultipleAsRead, data);
export const getNotificationById = (id) =>
  apiRequest("GET", apiEndpoints.notifications.read(id));
export const updateNotification = (id, data) =>
  apiRequest("PUT", apiEndpoints.notifications.update(id), data);
export const partialUpdateNotification = (id, data) =>
  apiRequest("PATCH", apiEndpoints.notifications.partialUpdate(id), data);
export const deleteNotification = (id) =>
  apiRequest("DELETE", apiEndpoints.notifications.delete(id));
export const markNotificationAsRead = (id) =>
  apiRequest("POST", apiEndpoints.notifications.markAsRead(id));

// Posts API functions
export const listPosts = () => apiRequest("GET", apiEndpoints.posts.list);
export const createPost = (data) =>
  apiRequest("POST", apiEndpoints.posts.create, data);
export const checkSlug = (data) =>
  apiRequest("POST", apiEndpoints.posts.checkSlug, data);
export const getFeaturedPosts = () =>
  apiRequest("GET", apiEndpoints.posts.featured);
export const getMostViewedPosts = () =>
  apiRequest("GET", apiEndpoints.posts.mostViewed);
export const getPostById = (id) =>
  apiRequest("GET", apiEndpoints.posts.read(id));
export const updatePost = (id, data) =>
  apiRequest("PUT", apiEndpoints.posts.update(id), data);
export const partialUpdatePost = (id, data) =>
  apiRequest("PATCH", apiEndpoints.posts.partialUpdate(id), data);
export const deletePost = (id) =>
  apiRequest("DELETE", apiEndpoints.posts.delete(id));
export const downvotePost = (id) =>
  apiRequest("POST", apiEndpoints.posts.downvote(id));
export const upvotePost = (id) =>
  apiRequest("POST", apiEndpoints.posts.upvote(id));
export const viewPost = (id) => apiRequest("GET", apiEndpoints.posts.view(id));
export const searchPosts = (query) =>
  apiRequest(
    "GET",
    `${apiEndpoints.posts.search}?search=${encodeURIComponent(query)}`
  );
export const getPostsByTag = (tag) =>
  apiRequest(
    "GET",
    `${apiEndpoints.posts.byTag}?tag=${encodeURIComponent(tag)}`
  );
export const getPostsByCategory = (category) =>
  apiRequest(
    "GET",
    `${apiEndpoints.posts.byCategory}?category=${encodeURIComponent(category)}`
  );
export const trackPostView = (id) =>
  apiRequest("POST", apiEndpoints.posts.trackView(id));
export const engagePost = (id, data) =>
  apiRequest("POST", apiEndpoints.posts.engage(id), data);

// Tags API functions
export const listTags = () => apiRequest("GET", apiEndpoints.tags.list);
export const createTag = (data) =>
  apiRequest("POST", apiEndpoints.tags.create, data);
export const getTagById = (id) => apiRequest("GET", apiEndpoints.tags.read(id));
export const updateTag = (id, data) =>
  apiRequest("PUT", apiEndpoints.tags.update(id), data);
export const partialUpdateTag = (id, data) =>
  apiRequest("PATCH", apiEndpoints.tags.partialUpdate(id), data);
export const deleteTag = (id) =>
  apiRequest("DELETE", apiEndpoints.tags.delete(id));

// Users API functions

// GET /users/ - List all users
export const listUsers = () => apiRequest("GET", apiEndpoints.users.list);

// GET /users/me/ - Get details of the current logged-in user
export const getUserMe = () => apiRequest("GET", apiEndpoints.users.me);

// GET /users/{id}/ - Retrieve details of a specific user by ID
export const getUserById = (id) =>
  apiRequest("GET", apiEndpoints.users.read(id));

// POST /users/{id}/contact/ - Contact a specific user by ID
export const contactUser = (id, data) =>
  apiRequest("POST", apiEndpoints.users.contact(id), data);

// POST /users/ - Create a new user
export const createUserProfile = (data) =>
  apiRequest("POST", apiEndpoints.users.create, data);

// PUT /users/{id}/ - Update a specific user by ID
export const updateUserProfileById = (id, data) =>
  apiRequest("PUT", apiEndpoints.users.update(id), data);

// PATCH /users/{id}/ - Partially update a specific user by ID
export const partialUpdateUserProfileById = (id, data) =>
  apiRequest("PATCH", apiEndpoints.users.partial_update(id), data);

// DELETE /users/{id}/ - Delete a specific user by ID
export const deleteUserProfileById = (id) =>
  apiRequest("DELETE", apiEndpoints.users.delete(id));

// Authors API functions
export const listAuthors = () => apiRequest("GET", apiEndpoints.authors.list);
export const getAuthorById = (id) =>
  apiRequest("GET", apiEndpoints.authors.read(id));
export const contactAuthor = (id, data) =>
  apiRequest("POST", apiEndpoints.authors.contact(id), data);
export const searchAuthors = (query) =>
  apiRequest(
    "GET",
    `${apiEndpoints.authors.search}?search=${encodeURIComponent(query)}`
  );
