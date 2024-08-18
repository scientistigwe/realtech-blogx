import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "./../../hooks/UseForm";
import {
  createPost,
  uploadThumbnail,
  clearError,
} from "../../redux/slices/postsSlice";
import { apiEndpoints } from "./../../api/apiEndpoints";

const initialFormData = {
  title: "",
  content: "",
  excerpt: "",
  metaDescription: "",
  metaTitle: "",
  metaKeywords: "",
  publicationDate: "",
  primaryCategory: "",
  subcategory: "",
  tags: "",
  isPublic: true,
};

const CreatePost = () => {
  const { formData, handleChange, resetForm } = useForm(initialFormData);
  const [primaryCategories, setPrimaryCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [image, setImage] = useState(null);
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.posts
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch primary categories
        const primaryResponse = await fetch(apiEndpoints.categories.primary);
        if (!primaryResponse.ok)
          throw new Error("Failed to load primary categories.");
        const primaryData = await primaryResponse.json();
        setPrimaryCategories(primaryData);

        // Fetch subcategories
        const subcategoriesResponse = await fetch(
          apiEndpoints.categories.subcategories
        );
        if (!subcategoriesResponse.ok)
          throw new Error("Failed to load subcategories.");
        const subcategoriesData = await subcategoriesResponse.json();
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error(error.message || "Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (successMessage) {
      resetForm();
      navigate("/posts");
    }
  }, [successMessage, navigate, resetForm]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Dispatch the action to create a new post
      const resultAction = await dispatch(createPost({ ...formData }));

      if (createPost.fulfilled.match(resultAction)) {
        const postId = resultAction.payload.id;

        // Upload image if provided
        if (image) {
          const formDataImage = new FormData();
          formDataImage.append("thumbnail", image);

          const imageUploadResultAction = await dispatch(
            uploadThumbnail({ postId, file: image })
          );

          if (uploadThumbnail.rejected.match(imageUploadResultAction)) {
            dispatch(clearError());
          }
        }
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      dispatch(clearError());
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create Post</h1>
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => dispatch(clearError())}
          dismissible
        >
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => dispatch(clearError())}
          dismissible
        >
          {errorMessage}
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

        <Form.Group controlId="formPostExcerpt" className="mt-3">
          <Form.Label>Excerpt</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter post excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formMetaDescription" className="mt-3">
          <Form.Label>Meta Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meta description"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formMetaTitle" className="mt-3">
          <Form.Label>Meta Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meta title"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formMetaKeywords" className="mt-3">
          <Form.Label>Meta Keywords</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meta keywords (comma-separated)"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPublicationDate" className="mt-3">
          <Form.Label>Publication Date</Form.Label>
          <Form.Control
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPostPrimaryCategory" className="mt-3">
          <Form.Label>Primary Category</Form.Label>
          <Form.Control
            as="select"
            name="primaryCategory"
            value={formData.primaryCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select a primary category</option>
            {primaryCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formPostSubcategory" className="mt-3">
          <Form.Label>Subcategory</Form.Label>
          <Form.Control
            as="select"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
          >
            <option value="">Select a subcategory</option>
            {subcategories
              .filter(
                (sub) => sub.primaryCategoryId === formData.primaryCategory
              )
              .map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
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
          <Form.Label>Thumbnail Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group controlId="formPostIsPublic" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Make this post public"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Create Post"}
        </Button>
      </Form>
    </div>
  );
};

export default CreatePost;
