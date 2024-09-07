import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useCreateComment } from "../../hooks/useComments"; // Custom hook for adding a comment

const AddComment = ({ postId }) => {
  const [formData, setFormData] = useState({ text: "" });
  const [addComment, { error, success, loading }] = useCreateComment(postId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      // Refresh comments or show success message
    } catch (err) {
      // Handle error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(formData);
      setFormData({ text: "" }); // Clear form on success
    } catch (err) {
      // Error is handled by hook's state
    }
  };

  return (
    <div className="add-comment">
      <h3>Add a Comment</h3>
      {success && <Alert variant="success">Comment added successfully!</Alert>}
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
          {loading ? <Spinner animation="border" /> : "Add Comment"}
        </Button>
      </Form>
      <Button
        variant="danger"
        onClick={() => handleDelete(comment.id)}
        disabled={deleting}
      >
        {deleting ? <Spinner animation="border" /> : "Delete"}
      </Button>
    </div>
  );
};

export default AddComment;
