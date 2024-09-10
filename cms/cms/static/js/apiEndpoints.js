const BASE_URL = "http://localhost:8000/cms-api/v1/";

export const apiEndpoints = {
  auth: {
    jwtCreate: `${BASE_URL}api/token/`, // POST /api/token/
    jwtRefresh: `${BASE_URL}api/token/refresh/`, // POST /api/token/refresh/
    jwtVerify: `${BASE_URL}api/token/verify/`, // POST /api/token/verify/
  },
  account: {
    updateRead: `${BASE_URL}account/update-account/`, // GET /account/update-account/
    updateCreate: `${BASE_URL}account/update-account/`, // POST /account/update-account/
  },
  categories: {
    list: `${BASE_URL}categories/`, // GET /categories/
    create: `${BASE_URL}categories/`, // POST /categories/
    createCategory: `${BASE_URL}categories/create_category/`, // POST /categories/create_category/
    listCategories: `${BASE_URL}categories/list_categories/`, // GET /categories/list_categories/
    navbarData: `${BASE_URL}categories/navbar_data/`, // GET /categories/navbar_data/
    read: (id) => `${BASE_URL}categories/${id}/`, // GET /categories/{id}/
    update: (id) => `${BASE_URL}categories/${id}/`, // PUT /categories/{id}/
    partialUpdate: (id) => `${BASE_URL}categories/${id}/`, // PATCH /categories/{id}/
    delete: (id) => `${BASE_URL}categories/${id}/`, // DELETE /categories/{id}/
    categoryDetail: (id) => `${BASE_URL}categories/${id}/category_detail/`, // GET /categories/{id}/category_detail/
    updateCategory: (id) => `${BASE_URL}categories/${id}/update_category/`, // GET /categories/{id}/update_category/
    updateCategoryPost: (id) =>
      `${BASE_URL}categories/${id}/update_category_post/`, // POST /categories/{id}/update_category_post/
  },
  comments: {
    list: `${BASE_URL}comments/`, // GET /comments/
    create: `${BASE_URL}comments/`, // POST /comments/
    createComment: `${BASE_URL}comments/create_comment/`, // POST /comments/create_comment/
    listComments: `${BASE_URL}comments/list_comments/`, // GET /comments/list_comments/
    read: (id) => `${BASE_URL}comments/${id}/`, // GET /comments/{id}/
    update: (id) => `${BASE_URL}comments/${id}/`, // PUT /comments/{id}/
    partialUpdate: (id) => `${BASE_URL}comments/${id}/`, // PATCH /comments/{id}/
    delete: (id) => `${BASE_URL}comments/${id}/`, // DELETE /comments/{id}/
    commentDetail: (id) => `${BASE_URL}comments/${id}/comment_detail/`, // GET /comments/{id}/comment_detail/
    deleteComment: (id) => `${BASE_URL}comments/${id}/delete_comment/`, // POST /comments/{id}/delete_comment/
    downvote: (id) => `${BASE_URL}comments/${id}/downvote/`, // POST /comments/{id}/downvote/
    moderate: (id) => `${BASE_URL}comments/${id}/moderate/`, // POST /comments/{id}/moderate/
    updateComment: (id) => `${BASE_URL}comments/${id}/update_comment/`, // POST /comments/{id}/update_comment/
    upvote: (id) => `${BASE_URL}comments/${id}/upvote/`, // POST /comments/{id}/upvote/
  },
  logout: {
    create: `${BASE_URL}logout/`, // POST /logout/
  },
  notifications: {
    list: `${BASE_URL}notifications/`, // GET /notifications/
    create: `${BASE_URL}notifications/`, // POST /notifications/
    listNotifications: `${BASE_URL}notifications/list_notifications/`, // GET /notifications/list_notifications/
    markMultipleAsRead: `${BASE_URL}notifications/mark_multiple_as_read/`, // POST /notifications/mark_multiple_as_read/
    read: (id) => `${BASE_URL}notifications/${id}/`, // GET /notifications/{id}/
    update: (id) => `${BASE_URL}notifications/${id}/`, // PUT /notifications/{id}/
    partialUpdate: (id) => `${BASE_URL}notifications/${id}/`, // PATCH /notifications/{id}/
    delete: (id) => `${BASE_URL}notifications/${id}/`, // DELETE /notifications/{id}/
    markAsRead: (id) => `${BASE_URL}notifications/${id}/mark_as_read/`, // POST /notifications/{id}/mark_as_read/
    notificationDetail: (id) =>
      `${BASE_URL}notifications/${id}/notification_detail/`, // GET /notifications/{id}/notification_detail/
  },
  passwordChange: {
    changePassword: `${BASE_URL}password-change/`, // POST /password-change/
  },
  passwordResetConfirm: {
    confirmReset: `${BASE_URL}password-reset-confirm/`, // POST /password-reset-confirm/
  },
  passwordReset: {
    requestReset: `${BASE_URL}password-reset/request/`, // POST /password-reset/request/
  },
  posts: {
    list: `${BASE_URL}posts/`, // GET /posts/
    create: `${BASE_URL}posts/`, // POST /posts/
    byCategory: `${BASE_URL}posts/by-category/`, // GET /posts/by-category/
    byTag: `${BASE_URL}posts/by-tag/`, // GET /posts/by-tag/
    checkSlug: `${BASE_URL}posts/check_slug/`, // POST /posts/check_slug/
    featured: `${BASE_URL}posts/featured/`, // GET /posts/featured/
    form: `${BASE_URL}posts/form/`, // GET /posts/form/
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
    create: `${BASE_URL}register-user/`, // POST /register-user/
  },
  tags: {
    list: `${BASE_URL}tags/`, // GET /tags/
    create: `${BASE_URL}tags/`, // POST /tags/
    createTag: `${BASE_URL}tags/create_tag/`, // POST /tags/create_tag/
    listTags: `${BASE_URL}tags/list_tags/`, // GET /tags/list_tags/
    read: (id) => `${BASE_URL}tags/${id}/`, // GET /tags/{id}/
    update: (id) => `${BASE_URL}tags/${id}/`, // PUT /tags/{id}/
    partialUpdate: (id) => `${BASE_URL}tags/${id}/`, // PATCH /tags/{id}/
    delete: (id) => `${BASE_URL}tags/${id}/`, // DELETE /tags/{id}/
    deleteTag: (id) => `${BASE_URL}tags/${id}/delete_tag/`, // DELETE /tags/{id}/delete_tag/
    tagDetail: (id) => `${BASE_URL}tags/${id}/tag_detail/`, // GET /tags/{id}/tag_detail/
    updateTag: (id) => `${BASE_URL}tags/${id}/update_tag/`, // PUT /tags/{id}/update_tag/
  },
  users: {
    list: `${BASE_URL}users/`, // GET /users/
    create: `${BASE_URL}users/`, // POST /users/
    listUsers: `${BASE_URL}users/list_users/`, // GET /users/list_users/
    me: `${BASE_URL}users/me/`, // GET /users/me/
    read: (id) => `${BASE_URL}users/${id}/`, // GET /users/{id}/
    update: (id) => `${BASE_URL}users/${id}/`, // PUT /users/{id}/
    partialUpdate: (id) => `${BASE_URL}users/${id}/`, // PATCH /users/{id}/
    delete: (id) => `${BASE_URL}users/${id}/`, // DELETE /users/{id}/
    contact: (id) => `${BASE_URL}users/${id}/contact/`, // POST /users/{id}/contact/
    updateUser: (id) => `${BASE_URL}users/${id}/update_user/`, // GET /users/{id}/update_user/
    updateUserPost: (id) => `${BASE_URL}users/${id}/update_user_post/`, // POST /users/{id}/update_user_post/
  },
};
