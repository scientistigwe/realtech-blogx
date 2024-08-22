import React from "react";
import PostCard from "./PostCard";
import useAuth from "../../hooks/userAuth"; // Custom hook for current user
import { usePostList } from "../../hooks/usePost"; // Custom hook for fetching posts

const PostList = () => {
  const { currentUser } = useAuth(); // Get the current user
  const { posts, loading, error } = usePostList(); // Fetch posts

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p>Error loading posts: {error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mt-4">
        <p>No posts available.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {posts.map((post) => (
          <div className="col-md-6 mb-4" key={post.id}>
            <PostCard post={post} currentUser={currentUser} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
