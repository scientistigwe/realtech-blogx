import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { usePostById, useUpdatePost } from "../../hooks/usePosts";

const UpdatePost = ({ id }) => {
  const { post } = usePostById(id);
  const { response, error, updatePost } = useUpdatePost(); // Updated line
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (post) {
      setFormData({ title: post.title, content: post.content });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, formData); // Use updatePost from the hook
      // Handle successful post update (e.g., redirect or update state)
    } catch (err) {
      // Handle error
      console.error("Error updating post:", err);
    }
  };

  return (
    <div className="update-post">
      <h3>Update Post</h3>
      {post ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit">Update Post</Button>
          {error && <Alert variant="danger">{error.message}</Alert>}
        </Form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UpdatePost;
