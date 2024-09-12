// components/PostsByTag.js
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

const PostsByTag = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.fetchPostsByTag(tag);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/tags">Tags</Breadcrumb.Item>
        <Breadcrumb.Item active>Posts tagged with {tag}</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Posts tagged with {tag}</h2>
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

export default PostsByTag;
