// components/FeaturedPosts.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { usePosts } from "../../hooks/usePosts"; // Import the usePosts hook
import "../../styles/Components.css";

const FeaturedPosts = () => {
  const { fetchFeaturedPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeaturedPosts = async () => {
      try {
        const data = await fetchFeaturedPosts(); // Use the hook's method
        setPosts(data || []); // Ensure data is always an array
      } catch (err) {
        console.error("Error fetching featured posts:", err);
        setError(err.message || "Failed to fetch featured posts.");
      } finally {
        setLoading(false);
      }
    };

    getFeaturedPosts();
  }, [fetchFeaturedPosts]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Featured Posts</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Featured Posts</h2>
      {loading && <p>Loading...</p>}
      {error && (
        <Alert variant="danger">Error fetching featured posts: {error}</Alert>
      )}
      {!loading && !error && (
        <Row>
          <Col>
            <ListGroup>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <ListGroup.Item key={post.id}>{post.title}</ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No featured posts available.</ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FeaturedPosts;
