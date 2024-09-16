import React from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Alert,
  Spinner,
} from "react-bootstrap";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "./PostCard"; // Import the PostCard component
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PostList = () => {
  const { posts, error, loading } = usePosts.fetchPosts();

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Posts</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Posts</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PostList;
