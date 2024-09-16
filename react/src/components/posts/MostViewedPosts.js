// components/MostViewedPosts.js
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

const MostViewedPosts = () => {
  const { fetchMostViewedPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMostViewedPosts = async () => {
      try {
        const data = await fetchMostViewedPosts(); // Use the hook's method
        setPosts(data || []); // Ensure data is always an array
      } catch (err) {
        console.error("Error fetching most viewed posts:", err);
        setError(err.message || "Failed to fetch most viewed posts.");
      } finally {
        setLoading(false);
      }
    };

    getMostViewedPosts();
  }, [fetchMostViewedPosts]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Most Viewed Posts</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Most Viewed Posts</h2>
      {loading && <p>Loading...</p>}
      {error && (
        <Alert variant="danger">
          Error fetching most viewed posts: {error}
        </Alert>
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
                <ListGroup.Item>No posts available.</ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MostViewedPosts;
