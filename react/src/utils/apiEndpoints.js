export const apiEndpoints = {
  api: {
    // GET /api/check-auth/
    checkAuth: "api/check-auth/",
  },
  auth: {
    // POST /auth/jwt/create/
    jwtCreate: "auth/jwt/create/", // auth_jwt_create_create
    // POST /auth/jwt/refresh/
    jwtRefresh: "auth/jwt/refresh/", // auth_jwt_refresh_create
    // POST /auth/jwt/verify/
    jwtVerify: "auth/jwt/verify/", // auth_jwt_verify_create

    // POST /auth/users/
    usersCreate: "auth/users/", // auth_users_create
    // GET /auth/users/
    usersList: "auth/users/", // auth_users_list
    // POST /auth/users/activation/
    usersActivation: "auth/users/activation/", // auth_users_activation
    // GET /auth/users/me/
    usersMeRead: "auth/users/me/", // auth_users_me_read
    // PUT /auth/users/me/
    usersMeUpdate: "auth/users/me/", // auth_users_me_update
    // PATCH /auth/users/me/
    usersMePartialUpdate: "auth/users/me/", // auth_users_me_partial_update
    // DELETE /auth/users/me/
    usersMeDelete: "auth/users/me/", // auth_users_me_delete
    // POST /auth/users/resend_activation/
    usersResendActivation: "auth/users/resend_activation/", // auth_users_resend_activation
    // POST /auth/users/reset_password/
    usersResetPassword: "auth/users/reset_password/", // auth_users_reset_password
    // POST /auth/users/reset_password_confirm/
    usersResetPasswordConfirm: "auth/users/reset_password_confirm/", // auth_users_reset_password_confirm
    // POST /auth/users/reset_username/
    usersResetUsername: "auth/users/reset_username/", // auth_users_reset_username
    // POST /auth/users/reset_username_confirm/
    usersResetUsernameConfirm: "auth/users/reset_username_confirm/", // auth_users_reset_username_confirm
    // POST /auth/users/set_password/
    usersSetPassword: "auth/users/set_password/", // auth_users_set_password
    // POST /auth/users/set_username/
    usersSetUsername: "auth/users/set_username/", // auth_users_set_username
    // GET /auth/users/{id}/
    usersRead: (id) => `auth/users/${id}/`, // auth_users_read
    // PUT /auth/users/{id}/
    usersUpdate: (id) => `auth/users/${id}/`, // auth_users_update
    // PATCH /auth/users/{id}/
    usersPartialUpdate: (id) => `auth/users/${id}/`, // auth_users_partial_update
    // DELETE /auth/users/{id}/
    usersDelete: (id) => `auth/users/${id}/`, // auth_users_delete
  },
  categories: {
    // GET /categories/
    list: "categories/", // categories_list
    // POST /categories/
    create: "categories/", // categories_create
    // GET /categories/{id}/
    read: (id) => `categories/${id}/`, // categories_read
    // PUT /categories/{id}/
    update: (id) => `categories/${id}/`, // categories_update
    // PATCH /categories/{id}/
    partialUpdate: (id) => `categories/${id}/`, // categories_partial_update
    // DELETE /categories/{id}/
    delete: (id) => `categories/${id}/`, // categories_delete
  },
  comments: {
    // GET /comments/
    list: "comments/", // comments_list
    // POST /comments/
    create: "comments/", // comments_create
    // GET /comments/{id}/
    read: (id) => `comments/${id}/`, // comments_read
    // PUT /comments/{id}/
    update: (id) => `comments/${id}/`, // comments_update
    // PATCH /comments/{id}/
    partialUpdate: (id) => `comments/${id}/`, // comments_partial_update
    // DELETE /comments/{id}/
    delete: (id) => `comments/${id}/`, // comments_delete
    // POST /comments/{id}/downvote/
    downvote: (id) => `comments/${id}/downvote/`, // comments_downvote
    // POST /comments/{id}/moderate/
    moderate: (id) => `comments/${id}/moderate/`, // comments_moderate
    // POST /comments/{id}/upvote/
    upvote: (id) => `comments/${id}/upvote/`, // comments_upvote
  },
  notifications: {
    // GET /notifications/
    list: "notifications/", // notifications_list
    // POST /notifications/
    create: "notifications/", // notifications_create
    // POST /notifications/mark_multiple_as_read/
    markMultipleAsRead: "notifications/mark_multiple_as_read/", // notifications_mark_multiple_as_read
    // GET /notifications/{id}/
    read: (id) => `notifications/${id}/`, // notifications_read
    // PUT /notifications/{id}/
    update: (id) => `notifications/${id}/`, // notifications_update
    // PATCH /notifications/{id}/
    partialUpdate: (id) => `notifications/${id}/`, // notifications_partial_update
    // DELETE /notifications/{id}/
    delete: (id) => `notifications/${id}/`, // notifications_delete
    // POST /notifications/{id}/mark_as_read/
    markAsRead: (id) => `notifications/${id}/mark_as_read/`, // notifications_mark_as_read
  },
  posts: {
    // GET /posts/
    list: "posts/", // posts_list
    // POST /posts/
    create: "posts/", // posts_create
    // POST /posts/check_slug/
    checkSlug: "posts/check_slug/", // posts_check_slug
    // GET /posts/featured/
    featured: "posts/featured/", // posts_featured
    // GET /posts/most-viewed/
    mostViewed: "posts/most-viewed/", // posts_most_viewed
    // GET /posts/{id}/
    read: (id) => `posts/${id}/`, // posts_read
    // PUT /posts/{id}/
    update: (id) => `posts/${id}/`, // posts_update
    // PATCH /posts/{id}/
    partialUpdate: (id) => `posts/${id}/`, // posts_partial_update
    // DELETE /posts/{id}/
    delete: (id) => `posts/${id}/`, // posts_delete
    // POST /posts/{id}/downvote/
    downvote: (id) => `posts/${id}/downvote/`, // posts_downvote
    // POST /posts/{id}/upvote/
    upvote: (id) => `posts/${id}/upvote/`, // posts_upvote
    // GET /posts/{id}/view/
    view: (id) => `posts/${id}/view/`, // posts_view
    // GET /posts/search/
    search: "posts/search/", // posts_search
    // GET /posts/by-tag/
    byTag: "posts/by-tag/", // posts_by_tag
    // GET /posts/by-category/
    byCategory: "posts/by-category/", // posts_by_category
    // POST /posts/{id}/track-view/
    trackView: (id) => `posts/${id}/track-view/`, // posts_track_view
    // POST /posts/{id}/engage/
    engage: (id) => `posts/${id}/engage/`, // posts_engage
    // GET /posts/by-category/
  },
  tags: {
    // GET /tags/
    list: "tags/", // tags_list
    // POST /tags/
    create: "tags/", // tags_create
    // GET /tags/{id}/
    read: (id) => `tags/${id}/`, // tags_read
    // PUT /tags/{id}/
    update: (id) => `tags/${id}/`, // tags_update
    // PATCH /tags/{id}/
    partialUpdate: (id) => `tags/${id}/`, // tags_partial_update
    // DELETE /tags/{id}/
    delete: (id) => `tags/${id}/`, // tags_delete
  },
  users: {
    // GET /users/ - List all users
    list: "users/", // users_list

    // POST /users/ - Create a new user
    create: "users/", // users_create

    // GET /users/me/ - Get details of the current logged-in user
    me: "users/me/", // users_me

    // GET /users/{id}/ - Retrieve details of a specific user by ID
    read: (id) => `users/${id}/`, // users_read

    // PUT /users/{id}/ - Update a specific user by ID
    update: (id) => `users/${id}/`, // users_update

    // PATCH /users/{id}/ - Partially update a specific user by ID
    partial_update: (id) => `users/${id}/`, // users_partial_update

    // DELETE /users/{id}/ - Delete a specific user by ID
    delete: (id) => `users/${id}/`, // users_delete

    // POST /users/{id}/contact/ - Contact a specific user by ID
    contact: (id) => `users/${id}/contact/`, // users_contact
  },
  authors: {
    // GET /authors/
    list: "authors/", // authors_list
    // POST /authors/
    create: "authors/", // authors_create
    // GET /authors/me/
    me: "authors/me/", // authors_me
    // GET /authors/{id}/
    read: (id) => `authors/${id}/`, // authors_read
    // PUT /authors/{id}/
    update: (id) => `authors/${id}/`, // authors_update
    // PATCH /authors/{id}/
    partialUpdate: (id) => `authors/${id}/`, // authors_partial_update
    // DELETE /authors/{id}/
    delete: (id) => `authors/${id}/`, // authors_delete
    // POST /authors/{id}/contact/
    contact: (id) => `authors/${id}/contact/`, // authors_contact
    // GET /authors/search/
    search: "authors/search/", // authors_search
  },
};
