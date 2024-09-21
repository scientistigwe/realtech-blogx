import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "./PostCard";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PostList = () => {
  const { fetchPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [fetchPosts]);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Posts</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </Container>
  );
};

export default PostList;
