import React, { useState, useEffect } from "react";
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
import { useComments } from "../../hooks/useComments";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const DeleteComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteComment, loading, error, success } = useComments();
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteComment(id);
      setLocalSuccess("Comment deleted successfully!");
      navigate("/comments");
    } catch (err) {
      setLocalError("Failed to delete comment.");
    }
  };

  useEffect(() => {
    setLocalError(error);
    setLocalSuccess(success);
  }, [error, success]);

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
          {localError && <Alert variant="danger">{localError}</Alert>}
          {localSuccess && <Alert variant="success">{localSuccess}</Alert>}
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
