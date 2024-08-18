import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import { fetchPosts, clearError } from "../../redux/slices/postsSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const currentUser = useSelector((state) => state.auth.user?.username); // Assume you have a slice for authentication

  useEffect(() => {
    dispatch(fetchPosts());

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (loading)
    return (
      <div className="container mt-4">
        <div>Loading posts...</div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4">
        <div>Error: {error}</div>
      </div>
    );
  if (!Array.isArray(posts)) return null; // Safeguard against undefined posts

  return (
    <div className="container mt-4">
      <div className="row">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div className="col-md-6 mb-4" key={post.id}>
              <PostCard post={post} currentUser={currentUser} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
