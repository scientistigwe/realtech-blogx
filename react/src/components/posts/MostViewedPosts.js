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
import { postService } from "../../services/postsService";
import "../../styles/Components.css";

const MostViewedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMostViewedPosts = async () => {
      try {
        const data = await postService.fetchMostViewedPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMostViewedPosts();
  }, []);

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
              {posts.map((post) => (
                <ListGroup.Item key={post.id}>{post.title}</ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MostViewedPosts;
