// components/PostsByCategory.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { postService } from "../../services/postsService";
import "../../styles/Components.css";

const PostsByCategory = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.fetchPostsByCategory(category);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/categories">Categories</Breadcrumb.Item>
        <Breadcrumb.Item active>Posts in {category}</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Posts in {category}</h2>
      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger">Error: {error}</Alert>}
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

export default PostsByCategory;
