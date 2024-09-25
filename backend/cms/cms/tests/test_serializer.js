/**
 * Tests for the Django REST Framework serializers.
 */

const assert = require("assert");
const {
  CustomUserSerializer,
  PostSerializer,
  CommentSerializer,
  NotificationSerializer,
} = require("./serializers");

describe("CustomUserSerializer", () => {
  it("should serialize a CustomUser model correctly", () => {
    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      bio: "This is a test user.",
      website: "https://example.com",
      location: "Example City",
      profile_picture: "https://example.com/profile.jpg",
      social_profiles: { twitter: "@testuser" },
      last_active: "2023-04-20T12:00:00Z",
      is_author: true,
      role: "staff",
    };

    const serializer = new CustomUserSerializer(user);
    const serializedUser = serializer.data;

    assert.deepEqual(serializedUser, user);
  });
});

describe("PostSerializer", () => {
  it("should serialize a Post model correctly", () => {
    const post = {
      id: 1,
      title: "Test Post",
      content: "This is the content of the test post.",
      excerpt: "This is the excerpt of the test post.",
      author: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      status: "published",
      meta_description: "This is the meta description of the test post.",
      meta_title: "Test Post Title",
      publication_date: "2023-04-20",
      meta_keywords: "test, post, example",
      slug: "test-post",
      is_public: true,
      thumbnail: "https://example.com/post-thumbnail.jpg",
      category: {
        id: 1,
        name: "Test Category",
        slug: "test-category",
      },
      tags: [
        { id: 1, name: "test", slug: "test" },
        { id: 2, name: "example", slug: "example" },
      ],
      view_count: 100,
      upvotes: 50,
      downvotes: 10,
      created_at: "2023-04-20T12:00:00Z",
      updated_at: "2023-04-21T12:00:00Z",
    };

    const serializer = new PostSerializer(post);
    const serializedPost = serializer.data;

    assert.deepEqual(serializedPost, post);
  });
});

describe("CommentSerializer", () => {
  it("should serialize a Comment model correctly", () => {
    const comment = {
      id: 1,
      post: 1,
      author: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      content: "This is a test comment.",
      sentiment_score: 0.8,
      moderation_status: "approved",
      upvotes: 10,
      downvotes: 2,
      created_at: "2023-04-20T12:00:00Z",
      updated_at: "2023-04-20T12:00:00Z",
    };

    const serializer = new CommentSerializer(comment);
    const serializedComment = serializer.data;

    assert.deepEqual(serializedComment, comment);
  });
});

describe("NotificationSerializer", () => {
  it("should serialize a Notification model correctly", () => {
    const notification = {
      id: 1,
      user: 1,
      message: "You have a new notification.",
      is_read: false,
      created_at: "2023-04-20T12:00:00Z",
      updated_at: "2023-04-20T12:00:00Z",
    };

    const serializer = new NotificationSerializer(notification);
    const serializedNotification = serializer.data;

    assert.deepEqual(serializedNotification, notification);
  });
});
