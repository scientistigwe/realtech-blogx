import React from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchPostsByTag } from "../../hooks/usePosts";
import "../../styles/Components.css";

const PostsByTag = () => {
  const { tag } = useParams();
  const { posts, error, loading } = fetchPostsByTag(tag);

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
