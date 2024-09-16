import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
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

const UpdateComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getCommentById,
    updateComment,
    loading: fetchLoading,
    error: fetchError,
    success: fetchSuccess,
  } = useComments();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const data = await getCommentById(id);
        setContent(data.content);
      } catch (err) {
        setError("Failed to fetch comment.");
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [id, getCommentById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await updateComment(id, { content });
      setSuccess("Comment updated successfully!");
      navigate("/comments");
    } catch (err) {
      setError("Failed to update comment.");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    setError(fetchError);
    setSuccess(fetchSuccess);
  }, [fetchError, fetchSuccess]);

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/comments">Comments</Breadcrumb.Item>
        <Breadcrumb.Item active>Update Comment</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Update Comment</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                disabled={updateLoading}
                className="w-100"
              >
                {updateLoading ? "Updating..." : "Update Comment"}
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateComment;
