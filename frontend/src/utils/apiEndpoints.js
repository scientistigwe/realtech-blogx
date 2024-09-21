export const apiEndpoints = {
  auth: {
    jwtCreate: "auth/token/", // POST
    jwtRefresh: "auth/token/refresh/", // POST
    jwtVerify: "auth/token/verify/", // POST
    checkAuth: "auth/token/check_auth/", // GET
    usersCreate: "auth/users/", // POST
    logout: "auth/token/logout/", // POST
    usersList: "auth/users/", // GET
    usersActivation: "auth/users/activation/", // POST
    usersMeRead: "auth/users/me/", // GET
    usersMeUpdate: "auth/users/me/", // PUT
    usersMePartialUpdate: "auth/users/me/", // PATCH
    usersMeDelete: "auth/users/me/", // DELETE
    usersResendActivation: "auth/users/resend_activation/", // POST
    usersResetPassword: "auth/users/reset_password/", // POST
    usersResetPasswordConfirm: "auth/users/reset_password_confirm/", // POST
    usersResetUsername: "auth/users/reset_username/", // POST
    usersResetUsernameConfirm: "auth/users/reset_username_confirm/", // POST
    usersSetPassword: "auth/users/set_password/", // POST
    usersSetUsername: "auth/users/set_username/", // POST
    usersRead: (id) => `auth/users/${id}/`, // GET
    usersUpdate: (id) => `auth/users/${id}/`, // PUT
    usersPartialUpdate: (id) => `auth/users/${id}/`, // PATCH
    usersDelete: (id) => `auth/users/${id}/`, // DELETE
  },
  categories: {
    list: "cms-api/v1/categories/", // GET
    create: "cms-api/v1/categories/", // POST
    read: (id) => `cms-api/v1/categories/${id}/`, // GET
    update: (id) => `cms-api/v1/categories/${id}/`, // PUT
    partialUpdate: (id) => `cms-api/v1/categories/${id}/`, // PATCH
    delete: (id) => `cms-api/v1/categories/${id}/`, // DELETE
    subcategories: (id) => `cms-api/v1/categories/${id}/subcategories/`, // GET
  },
  comments: {
    list: "cms-api/v1/comments/", // GET
    create: "cms-api/v1/comments/", // POST
    read: (id) => `cms-api/v1/comments/${id}/`, // GET
    update: (id) => `cms-api/v1/comments/${id}/`, // PUT
    partialUpdate: (id) => `cms-api/v1/comments/${id}/`, // PATCH
    delete: (id) => `cms-api/v1/comments/${id}/`, // DELETE
    approve: (id) => `cms-api/v1/comments/${id}/approve/`, // POST
    reject: (id) => `cms-api/v1/comments/${id}/reject/`, // POST
    upvote: (id) => `cms-api/v1/comments/${id}/upvote/`, // POST
    downvote: (id) => `cms-api/v1/comments/${id}/downvote/`, // POST
  },
  notifications: {
    list: "cms-api/v1/notifications/", // GET
    create: "cms-api/v1/notifications/", // POST
    read: (id) => `cms-api/v1/notifications/${id}/`, // GET
    update: (id) => `cms-api/v1/notifications/${id}/`, // PUT
    partialUpdate: (id) => `cms-api/v1/notifications/${id}/`, // PATCH
    delete: (id) => `cms-api/v1/notifications/${id}/`, // DELETE
    markAsRead: (id) => `cms-api/v1/notifications/${id}/mark_as_read/`, // POST
    markAllAsRead: "cms-api/v1/notifications/mark_all_as_read/", // POST
  },
  posts: {
    list: "cms-api/v1/posts/", // GET
    create: "cms-api/v1/posts/", // POST
    read: (id) => `cms-api/v1/posts/${id}/`, // GET
    update: (id) => `cms-api/v1/posts/${id}/`, // PUT
    partialUpdate: (id) => `cms-api/v1/posts/${id}/`, // PATCH
    delete: (id) => `cms-api/v1/posts/${id}/`, // DELETE
    checkSlug: "cms-api/v1/posts/check_slug/", // POST
    featured: "cms-api/v1/posts/featured/", // GET
    mostViewed: "cms-api/v1/posts/most_viewed/", // GET
    upvote: (id) => `cms-api/v1/posts/${id}/upvote/`, // POST
    downvote: (id) => `cms-api/v1/posts/${id}/downvote/`, // POST
    view: (id) => `cms-api/v1/posts/${id}/view/`, // GET
    search: "cms-api/v1/posts/search/", // GET
    byTag: "cms-api/v1/posts/posts_by_tag/", // GET
    byCategory: "cms-api/v1/posts/posts_by_category/", // GET
    byAuthor: "cms-api/v1/posts/posts_by_author/", // GET
    byDateRange: "cms-api/v1/posts/posts_by_date_range/", // GET
    publish: (id) => `cms-api/v1/posts/${id}/publish/`, // POST
    analytics: "cms-api/v1/posts/analytics/", // POST
  },
  tags: {
    list: "cms-api/v1/tags/", // GET
    create: "cms-api/v1/tags/", // POST
    read: (id) => `cms-api/v1/tags/${id}/`, // GET
    update: (id) => `cms-api/v1/tags/${id}/`, // PUT
    partialUpdate: (id) => `cms-api/v1/tags/${id}/`, // PATCH
    delete: (id) => `cms-api/v1/tags/${id}/`, // DELETE
    mostUsed: "cms-api/v1/tags/most_used/", // GET
  },
  users: {
    list: "cms-api/v1/users/", // GET
    create: "cms-api/v1/users/", // POST
    me: "cms-api/v1/users/me/", // GET
    read: (id) => `cms-api/v1/users/${id}/`, // GET
    update: (id) => `cms-api/v1/users/${id}/`, // PUT
    partialUpdate: (id) => `cms-api/v1/users/${id}/`, // PATCH
    delete: (id) => `cms-api/v1/users/${id}/`, // DELETE
  },
};
