import apiClient from "./apiClient";
import { apiEndpoints } from "./apiEndpoints";

const createApi = (client) => ({
  auth: {
    // JWT Endpoints
    createJwt: (data) => client.post(apiEndpoints.auth.jwtCreate, data), // POST /api/token/
    refreshJwt: (data) => client.post(apiEndpoints.auth.jwtRefresh, data), // POST /api/token/refresh/
    verifyJwt: () => {
      const token = localStorage.getItem("accessToken");
      return client.post(
        apiEndpoints.auth.jwtVerify,
        { token },
        {
          headers: { Authorization: `Bearer ${token}` }, // POST /api/token/verify/
        }
      );
    },
  },
  categories: {
    list: () => client.get(apiEndpoints.categories.list), // GET /categories/
    create: (data) => client.post(apiEndpoints.categories.create, data), // POST /categories/
    read: (id) => client.get(apiEndpoints.categories.read(id)), // GET /categories/{id}/
    update: (id, data) => client.put(apiEndpoints.categories.update(id), data), // PUT /categories/{id}/
    partialUpdate: (id, data) =>
      client.patch(apiEndpoints.categories.partialUpdate(id), data), // PATCH /categories/{id}/
    delete: (id) => client.delete(apiEndpoints.categories.delete(id)), // DELETE /categories/{id}/
  },
  comments: {
    list: () => client.get(apiEndpoints.comments.list), // GET /comments/
    create: (data) => client.post(apiEndpoints.comments.create, data), // POST /comments/
    read: (id) => client.get(apiEndpoints.comments.read(id)), // GET /comments/{id}/
    update: (id, data) => client.put(apiEndpoints.comments.update(id), data), // PUT /comments/{id}/
    partialUpdate: (id, data) =>
      client.patch(apiEndpoints.comments.partialUpdate(id), data), // PATCH /comments/{id}/
    delete: (id) => client.delete(apiEndpoints.comments.delete(id)), // DELETE /comments/{id}/
    downvote: (id) => client.post(apiEndpoints.comments.downvote(id)), // POST /comments/{id}/downvote/
    moderate: (id) => client.post(apiEndpoints.comments.moderate(id)), // POST /comments/{id}/moderate/
    upvote: (id) => client.post(apiEndpoints.comments.upvote(id)), // POST /comments/{id}/upvote/
  },
  logout: {
    create: () => client.post(apiEndpoints.logout.create), // POST /logout/
  },
  notifications: {
    list: () => client.get(apiEndpoints.notifications.list), // GET /notifications/
    create: (data) => client.post(apiEndpoints.notifications.create, data), // POST /notifications/
    markAsRead: () => client.post(apiEndpoints.notifications.markAsRead), // POST /notifications/mark_as_read/
    read: (id) => client.get(apiEndpoints.notifications.read(id)), // GET /notifications/{id}/
    update: (id, data) =>
      client.put(apiEndpoints.notifications.update(id), data), // PUT /notifications/{id}/
    partialUpdate: (id, data) =>
      client.patch(apiEndpoints.notifications.partialUpdate(id), data), // PATCH /notifications/{id}/
    delete: (id) => client.delete(apiEndpoints.notifications.delete(id)), // DELETE /notifications/{id}/
  },
  posts: {
    list: () => client.get(apiEndpoints.posts.list), // GET /posts/
    create: (data) => client.post(apiEndpoints.posts.create, data), // POST /posts/
    byCategory: (category) =>
      client.get(apiEndpoints.posts.byCategory, { params: { category } }), // GET /posts/by-category/
    byTag: (tag) => client.get(apiEndpoints.posts.byTag, { params: { tag } }), // GET /posts/by-tag/
    checkSlug: (slug) => client.post(apiEndpoints.posts.checkSlug, { slug }), // POST /posts/check_slug/
    featured: () => client.get(apiEndpoints.posts.featured), // GET /posts/featured/
    mostViewed: () => client.get(apiEndpoints.posts.mostViewed), // GET /posts/most-viewed/
    search: (query) =>
      client.get(apiEndpoints.posts.search, { params: { query } }), // GET /posts/search/
    read: (id) => client.get(apiEndpoints.posts.read(id)), // GET /posts/{id}/
    update: (id, data) => client.put(apiEndpoints.posts.update(id), data), // PUT /posts/{id}/
    partialUpdate: (id, data) =>
      client.patch(apiEndpoints.posts.partialUpdate(id), data), // PATCH /posts/{id}/
    delete: (id) => client.delete(apiEndpoints.posts.delete(id)), // DELETE /posts/{id}/
    downvote: (id) => client.post(apiEndpoints.posts.downvote(id)), // POST /posts/{id}/downvote/
    engage: (id) => client.post(apiEndpoints.posts.engage(id)), // POST /posts/{id}/engage/
    upvote: (id) => client.post(apiEndpoints.posts.upvote(id)), // POST /posts/{id}/upvote/
    view: (id) => client.get(apiEndpoints.posts.view(id)), // GET /posts/{id}/view/
  },
  register: {
    create: (data) => client.post(apiEndpoints.register.create, data), // POST /register/
  },
  tags: {
    list: () => client.get(apiEndpoints.tags.list), // GET /tags/
    create: (data) => client.post(apiEndpoints.tags.create, data), // POST /tags/
    read: (id) => client.get(apiEndpoints.tags.read(id)), // GET /tags/{id}/
    update: (id, data) => client.put(apiEndpoints.tags.update(id), data), // PUT /tags/{id}/
    partialUpdate: (id, data) =>
      client.patch(apiEndpoints.tags.partialUpdate(id), data), // PATCH /tags/{id}/
    delete: (id) => client.delete(apiEndpoints.tags.delete(id)), // DELETE /tags/{id}/
  },
  users: {
    list: () => client.get(apiEndpoints.users.list), // GET /users/
    create: (data) => client.post(apiEndpoints.users.create, data), // POST /users/
    me: () => client.get(apiEndpoints.users.me), // GET /users/me/
    read: (id) => client.get(apiEndpoints.users.read(id)), // GET /users/{id}/
    update: (id, data) => client.put(apiEndpoints.users.update(id), data), // PUT /users/{id}/
    partialUpdate: (id, data) =>
      client.patch(apiEndpoints.users.partialUpdate(id), data), // PATCH /users/{id}/
    delete: (id) => client.delete(apiEndpoints.users.delete(id)), // DELETE /users/{id}/
    contact: (id, data) => client.post(apiEndpoints.users.contact(id), data), // POST /users/{id}/contact/
  },
});

const api = createApi(apiClient);

export default api;
