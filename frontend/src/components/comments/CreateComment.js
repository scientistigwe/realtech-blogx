import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Breadcrumb,
} from "react-bootstrap";
import { useComments } from "../../hooks/useComments";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const CreateComment = () => {
  const {
    createComment,
    loading: hookLoading,
    error: hookError,
  } = useComments();
  const [content, setContent] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createComment({ content });
      setSuccess("Comment created successfully!");
      setContent("");
    } catch (err) {
      setError("Failed to create comment.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/comments">Comments</Breadcrumb.Item>
        <Breadcrumb.Item active>Create Comment</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Create Comment</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
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
              disabled={localLoading || hookLoading}
              className="w-100"
            >
              {localLoading || hookLoading ? "Creating..." : "Create Comment"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateComment;
