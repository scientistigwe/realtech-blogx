// apiEndpoints.js
const BASE_URL = "http://localhost:8000/cms-api/v1/";

export const apiEndpoints = {
  auth: {
    jwtCreate: `${BASE_URL}api/token/`, // POST /api/token/
    jwtRefresh: `${BASE_URL}api/token/refresh/`, // POST /api/token/refresh/
    jwtVerify: `${BASE_URL}api/token/verify/`, // POST /api/token/verify/
  },
  categories: {
    list: `${BASE_URL}categories/`, // GET /categories/
    create: `${BASE_URL}categories/`, // POST /categories/
    read: (id) => `${BASE_URL}categories/${id}/`, // GET /categories/{id}/
    update: (id) => `${BASE_URL}categories/${id}/`, // PUT /categories/{id}/
    partialUpdate: (id) => `${BASE_URL}categories/${id}/`, // PATCH /categories/{id}/
    delete: (id) => `${BASE_URL}categories/${id}/`, // DELETE /categories/{id}/
  },
  comments: {
    list: `${BASE_URL}comments/`, // GET /comments/
    create: `${BASE_URL}comments/`, // POST /comments/
    read: (id) => `${BASE_URL}comments/${id}/`, // GET /comments/{id}/
    update: (id) => `${BASE_URL}comments/${id}/`, // PUT /comments/{id}/
    partialUpdate: (id) => `${BASE_URL}comments/${id}/`, // PATCH /comments/{id}/
    delete: (id) => `${BASE_URL}comments/${id}/`, // DELETE /comments/{id}/
    downvote: (id) => `${BASE_URL}comments/${id}/downvote/`, // POST /comments/{id}/downvote/
    moderate: (id) => `${BASE_URL}comments/${id}/moderate/`, // POST /comments/{id}/moderate/
    upvote: (id) => `${BASE_URL}comments/${id}/upvote/`, // POST /comments/{id}/upvote/
  },
  logout: {
    create: `${BASE_URL}logout/`, // POST /logout/
  },
  notifications: {
    list: `${BASE_URL}notifications/`, // GET /notifications/
    create: `${BASE_URL}notifications/`, // POST /notifications/
    markAsRead: `${BASE_URL}notifications/mark_as_read/`, // POST /notifications/mark_as_read/
    read: (id) => `${BASE_URL}notifications/${id}/`, // GET /notifications/{id}/
    update: (id) => `${BASE_URL}notifications/${id}/`, // PUT /notifications/{id}/
    partialUpdate: (id) => `${BASE_URL}notifications/${id}/`, // PATCH /notifications/{id}/
    delete: (id) => `${BASE_URL}notifications/${id}/`, // DELETE /notifications/{id}/
  },
  posts: {
    list: `${BASE_URL}posts/`, // GET /posts/
    create: `${BASE_URL}posts/`, // POST /posts/
    byCategory: `${BASE_URL}posts/by-category/`, // GET /posts/by-category/
    byTag: `${BASE_URL}posts/by-tag/`, // GET /posts/by-tag/
    checkSlug: `${BASE_URL}posts/check_slug/`, // POST /posts/check_slug/
    featured: `${BASE_URL}posts/featured/`, // GET /posts/featured/
    mostViewed: `${BASE_URL}posts/most-viewed/`, // GET /posts/most-viewed/
    search: `${BASE_URL}posts/search/`, // GET /posts/search/
    read: (id) => `${BASE_URL}posts/${id}/`, // GET /posts/{id}/
    update: (id) => `${BASE_URL}posts/${id}/`, // PUT /posts/{id}/
    partialUpdate: (id) => `${BASE_URL}posts/${id}/`, // PATCH /posts/{id}/
    delete: (id) => `${BASE_URL}posts/${id}/`, // DELETE /posts/{id}/
    downvote: (id) => `${BASE_URL}posts/${id}/downvote/`, // POST /posts/{id}/downvote/
    engage: (id) => `${BASE_URL}posts/${id}/engage/`, // POST /posts/{id}/engage/
    upvote: (id) => `${BASE_URL}posts/${id}/upvote/`, // POST /posts/{id}/upvote/
    view: (id) => `${BASE_URL}posts/${id}/view/`, // GET /posts/{id}/view/
  },
  register: {
    create: `${BASE_URL}register/`, // POST /register/
  },
  tags: {
    list: `${BASE_URL}tags/`, // GET /tags/
    create: `${BASE_URL}tags/`, // POST /tags/
    read: (id) => `${BASE_URL}tags/${id}/`, // GET /tags/{id}/
    update: (id) => `${BASE_URL}tags/${id}/`, // PUT /tags/{id}/
    partialUpdate: (id) => `${BASE_URL}tags/${id}/`, // PATCH /tags/{id}/
    delete: (id) => `${BASE_URL}tags/${id}/`, // DELETE /tags/{id}/
  },
  users: {
    list: `${BASE_URL}users/`, // GET /users/
    create: `${BASE_URL}users/`, // POST /users/
    me: `${BASE_URL}users/me/`, // GET /users/me/
    read: (id) => `${BASE_URL}users/${id}/`, // GET /users/{id}/
    update: (id) => `${BASE_URL}users/${id}/`, // PUT /users/{id}/
    partialUpdate: (id) => `${BASE_URL}users/${id}/`, // PATCH /users/{id}/
    delete: (id) => `${BASE_URL}users/${id}/`, // DELETE /users/{id}/
    contact: (id) => `${BASE_URL}users/${id}/contact/`, // POST /users/{id}/contact/
  },
  passwordChange: {
    changePassword: `${BASE_URL}password-change/change_password/`, // POST /password-change/change_password/
  },
  passwordResetConfirm: {
    confirmReset: `${BASE_URL}password-reset-confirm/confirm_reset/`, // POST /password-reset-confirm/confirm_reset/
  },
  passwordReset: {
    requestReset: `${BASE_URL}password-reset/request_reset/`, // POST /password-reset/request_reset/
  },
  deleteAccount: {
    updateAccount: `${BASE_URL}delete-account/update_account/`, // PUT /delete-account/update_account/
  },
};
