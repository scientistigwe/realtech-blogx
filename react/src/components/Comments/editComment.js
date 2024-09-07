import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useUpdateComment } from "../../hooks/useComments"; // Custom hook for updating a comment

const EditComment = ({ commentId }) => {
  const [formData, setFormData] = useState({ text: "" });
  const [updateComment, { error, success, loading }] =
    useUpdateComment(commentId);

  useEffect(() => {
    const fetchComment = async () => {
      // Fetch the current comment data and set it to the form
      // This should be implemented in the hook or component
    };
    fetchComment();
  }, [commentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateComment(formData);
    } catch (err) {
      // Error is handled by hook's state
    }
  };

  return (
    <div className="edit-comment">
      <h3>Edit Comment</h3>
      {success && (
        <Alert variant="success">Comment updated successfully!</Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" /> : "Update Comment"}
        </Button>
      </Form>
    </div>
  );
};

export default EditComment;
