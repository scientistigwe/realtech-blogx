import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { usePosts } from "../../hooks/usePosts";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PostEdit = () => {
  const { id } = useParams();
  const { post, error: fetchError, loading: fetchLoading } = usePosts(id);
  const {
    updatePost,
    error: updateError,
    success,
    loading: updateLoading,
  } = usePosts();

  const [postData, setPostData] = useState(post);

  useEffect(() => {
    setPostData(post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostData((prevPost) => ({
      ...prevPost,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPostData((prevPost) => ({
      ...prevPost,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePost(id, postData);
  };

  if (fetchLoading) return <Spinner animation="border" />;
  if (fetchError) return <Alert variant="danger">{fetchError}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Edit Post</h2>
      <Form onSubmit={handleSubmit}>
        {updateError && <Alert variant="danger">{updateError}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {updateLoading && <Spinner animation="border" />}

        {/* Title */}
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={postData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Content */}
        <Form.Group controlId="formContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="content"
            value={postData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Excerpt */}
        <Form.Group controlId="formExcerpt">
          <Form.Label>Excerpt</Form.Label>
          <Form.Control
            type="text"
            name="excerpt"
            value={postData.excerpt}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author Fields */}
        <Form.Group controlId="formAuthorUsername">
          <Form.Label>Author Username</Form.Label>
          <Form.Control
            type="text"
            name="author.username"
            value={postData.author.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Other Author Fields */}
        {/* Repeat for other author fields similarly */}

        {/* Status */}
        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            type="text"
            name="status"
            value={postData.status}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Meta Fields */}
        {/* Repeat for meta fields similarly */}

        {/* Is Public */}
        <Form.Group controlId="formIsPublic">
          <Form.Check
            type="checkbox"
            name="is_public"
            label="Is Public"
            checked={postData.is_public}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Category Fields */}
        {/* Repeat for category fields similarly */}

        {/* Thumbnail */}
        <Form.Group controlId="formThumbnail">
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
          />
          {postData.thumbnail && (
            <img
              src={URL.createObjectURL(postData.thumbnail)}
              alt="Thumbnail Preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Post
        </Button>
      </Form>
    </Container>
  );
};

export default PostEdit;
