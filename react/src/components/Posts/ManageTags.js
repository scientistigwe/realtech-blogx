import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useManageTags } from "../../hooks/usePosts";

const ManageTags = ({ postId }) => {
  const [tags, setTags] = useState([]);
  const { response, error } = useManageTags(postId, tags);

  const handleChange = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await manageTags(postId, tags);
      // Handle successful tag management (e.g., update state)
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="manage-tags">
      <h3>Manage Tags</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            value={tags.join(", ")}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit">Update Tags</Button>
        {error && <Alert variant="danger">{error.message}</Alert>}
      </Form>
    </div>
  );
};

export default ManageTags;
