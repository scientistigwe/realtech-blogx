import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../hooks/UseForm";
import {
  fetchPostById,
  updatePost,
  uploadThumbnail,
  clearError,
} from "../../redux/slices/postsSlice";
import { apiEndpoints } from "../../api/apiEndpoints";

const initialFormData = {
  title: "",
  content: "",
  category: "",
  tags: "",
};

const UpdatePost = () => {
  const { id } = useParams();
  const { formData, handleChange, resetForm } = useForm(initialFormData);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const { loading, error, successMessage, currentPost } = useSelector(
    (state) => state.posts
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiEndpoints.categories.list, {
          credentials: "include", // Ensure cookies are sent
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        await dispatch(fetchPostById(id));
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    fetchPost();
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPost) {
      // Populate form with current post data
      const { title, content, category, tags } = currentPost;
      resetForm({
        title,
        content,
        category,
        tags: tags ? tags.join(", ") : "",
      });
    }
  }, [currentPost, resetForm]);

  useEffect(() => {
    if (successMessage) {
      resetForm();
      navigate(`/posts/${id}`);
    }
  }, [successMessage, navigate, resetForm, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Dispatch the action to update the post
      const resultAction = await dispatch(updatePost({ id, ...formData }));

      if (updatePost.fulfilled.match(resultAction)) {
        const postId = resultAction.payload.id;

        // Upload image if provided
        if (image) {
          const formDataImage = new FormData();
          formDataImage.append("image", image);

          const imageUploadResultAction = await dispatch(
            uploadThumbnail({ postId, file: image })
          );

          if (uploadThumbnail.rejected.match(imageUploadResultAction)) {
            dispatch(clearError());
          }
        }
      } else {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      dispatch(clearError());
    }
  };

  return (
    <div className="container mt-4">
      <h1>Edit Post</h1>
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => dispatch(clearError())}
          dismissible
        >
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert
          variant="danger"
          onClose={() => dispatch(clearError())}
          dismissible
        >
          {error}
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
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Update Post"}
        </Button>
      </Form>
    </div>
  );
};

export default UpdatePost;
