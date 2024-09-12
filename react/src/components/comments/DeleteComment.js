// components/comments/DeleteComment.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Breadcrumb,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { commentService } from "../../services/commentsService";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const DeleteComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await commentService.deleteComment(id);
      setSuccess("Comment deleted successfully!");
      navigate("/comments");
    } catch (err) {
      setError("Failed to delete comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/comments">Comments</Breadcrumb.Item>
        <Breadcrumb.Item active>Delete Comment</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h2 className="mb-4">Delete Comment</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <p>Are you sure you want to delete this comment?</p>
              <Button variant="danger" onClick={handleDelete}>
                Delete Comment
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteComment;
