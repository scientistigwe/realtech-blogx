import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPostById, loading: postLoading } = usePosts();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    try {
      const fetchedPost = await fetchPostById(id);
      setPost(fetchedPost);
    } catch (err) {
      setError("Failed to load post details");
      console.error(err);
    }
  }, [id, fetchPostById]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (postLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!post) return null;

  return (
    <Container className="my-5">
      <Card>
        <Card.Header as="h2">{post.title}</Card.Header>
        <Card.Body>
          <Card.Text>{post.content}</Card.Text>
          <hr />
          <Card.Footer>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Back to List
            </Button>
          </Card.Footer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
