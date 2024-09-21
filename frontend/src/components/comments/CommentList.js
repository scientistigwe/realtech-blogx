import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Breadcrumb,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useComments } from "../../hooks/useComments";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const { fetchComments, loading, error } = useComments();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments();
        setComments(data);
      } catch (err) {
        // error is handled by the hook
      }
    };

    loadComments();
  }, [fetchComments]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Comments</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Comments</h2>
          {error && <Alert variant="danger">{error.message}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <ListGroup.Item key={comment.id}>
                    <strong>{comment.author}</strong>: {comment.content}
                  </ListGroup.Item>
                ))
              ) : (
                <Alert variant="info">No comments found.</Alert>
              )}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CommentList;
