// components/posts/UserPosts.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { postService } from "../../services/postsService";
import PostCard from "./PostCard"; // Import the PostCard component
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const allPosts = await postService.fetchPosts();
        const userPosts = userId
          ? allPosts.filter((post) => post.user.id === userId)
          : [];

        setPosts(userPosts);
      } catch (err) {
        setError("Failed to load user posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>User Posts</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">User's Posts</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p>No posts found for this user.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserPosts;
