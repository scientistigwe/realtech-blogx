import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { usePostDetails, useUpdatePost } from "./../../hooks/usePost";
import api from "./../../api/apiClient";

const UpdatePost = () => {
  const { postId } = useParams();
  const {
    post,
    loading: postLoading,
    error: postError,
  } = usePostDetails(postId);
  const {
    updatePost,
    loading: updateLoading,
    error: updateError,
  } = useUpdatePost();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags ? post.tags.join(", ") : "",
      });
    }
  }, [post]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(api.categories.list, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load categories.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error.message || "Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setImage(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(postId, formData);

      if (image) {
        const formDataImage = new FormData();
        formDataImage.append("image", image);

        await api.posts.uploadThumbnail(postId, formDataImage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (postLoading) {
    return <div>Loading post...</div>;
  }

  if (postError) {
    return <div>Error: {postError.message}</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Edit Post</h1>
      {updateError && (
        <Alert variant="danger" dismissible>
          {updateError}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formPostTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPostContent" className="mt-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter post content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPostCategory" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formPostTags" className="mt-3">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Data Science, Machine Learning"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPostImage" className="mt-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleChange} />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          disabled={updateLoading}
        >
          {updateLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Update Post"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default UpdatePost;
