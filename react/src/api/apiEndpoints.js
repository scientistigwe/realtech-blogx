export const apiEndpoints = {
  auth: {
    jwtCreate: "api/token/", // POST /api/token/
    jwtRefresh: "api/token/refresh/", // POST /api/token/refresh/
    jwtVerify: "api/token/verify/", // POST /api/token/verify/
  },
  categories: {
    list: "categories/", // GET /categories/
    create: "categories/", // POST /categories/
    read: (id) => `categories/${id}/`, // GET /categories/{id}/
    update: (id) => `categories/${id}/`, // PUT /categories/{id}/
    partialUpdate: (id) => `categories/${id}/`, // PATCH /categories/{id}/
    delete: (id) => `categories/${id}/`, // DELETE /categories/{id}/
  },
  comments: {
    list: "comments/", // GET /comments/
    create: "comments/", // POST /comments/
    read: (id) => `comments/${id}/`, // GET /comments/{id}/
    update: (id) => `comments/${id}/`, // PUT /comments/{id}/
    partialUpdate: (id) => `comments/${id}/`, // PATCH /comments/{id}/
    delete: (id) => `comments/${id}/`, // DELETE /comments/{id}/
    downvote: (id) => `comments/${id}/downvote/`, // POST /comments/{id}/downvote/
    moderate: (id) => `comments/${id}/moderate/`, // POST /comments/{id}/moderate/
    upvote: (id) => `comments/${id}/upvote/`, // POST /comments/{id}/upvote/
  },
  logout: {
    create: "logout/", // POST /logout/
  },
  notifications: {
    list: "notifications/", // GET /notifications/
    create: "notifications/", // POST /notifications/
    markAsRead: "notifications/mark_as_read/", // POST /notifications/mark_as_read/
    read: (id) => `notifications/${id}/`, // GET /notifications/{id}/
    update: (id) => `notifications/${id}/`, // PUT /notifications/{id}/
    partialUpdate: (id) => `notifications/${id}/`, // PATCH /notifications/{id}/
    delete: (id) => `notifications/${id}/`, // DELETE /notifications/{id}/
  },
  posts: {
    list: "posts/", // GET /posts/
    create: "posts/", // POST /posts/
    byCategory: "posts/by-category/", // GET /posts/by-category/
    byTag: "posts/by-tag/", // GET /posts/by-tag/
    checkSlug: "posts/check_slug/", // POST /posts/check_slug/
    featured: "posts/featured/", // GET /posts/featured/
    mostViewed: "posts/most-viewed/", // GET /posts/most-viewed/
    search: "posts/search/", // GET /posts/search/
    read: (id) => `posts/${id}/`, // GET /posts/{id}/
    update: (id) => `posts/${id}/`, // PUT /posts/{id}/
    partialUpdate: (id) => `posts/${id}/`, // PATCH /posts/{id}/
    delete: (id) => `posts/${id}/`, // DELETE /posts/{id}/
    downvote: (id) => `posts/${id}/downvote/`, // POST /posts/{id}/downvote/
    engage: (id) => `posts/${id}/engage/`, // POST /posts/{id}/engage/
    upvote: (id) => `posts/${id}/upvote/`, // POST /posts/{id}/upvote/
    view: (id) => `posts/${id}/view/`, // GET /posts/{id}/view/
  },
  register: {
    create: "register/", // POST /register/
  },
  tags: {
    list: "tags/", // GET /tags/
    create: "tags/", // POST /tags/
    read: (id) => `tags/${id}/`, // GET /tags/{id}/
    update: (id) => `tags/${id}/`, // PUT /tags/{id}/
    partialUpdate: (id) => `tags/${id}/`, // PATCH /tags/{id}/
    delete: (id) => `tags/${id}/`, // DELETE /tags/{id}/
  },
  users: {
    list: "users/", // GET /users/
    create: "users/", // POST /users/
    me: "users/me/", // GET /users/me/
    read: (id) => `users/${id}/`, // GET /users/{id}/
    update: (id) => `users/${id}/`, // PUT /users/{id}/
    partialUpdate: (id) => `users/${id}/`, // PATCH /users/{id}/
    delete: (id) => `users/${id}/`, // DELETE /users/{id}/
    contact: (id) => `users/${id}/contact/`, // POST /users/{id}/contact/
  },
};
