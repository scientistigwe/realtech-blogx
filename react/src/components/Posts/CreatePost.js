import React from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useCreatePost } from "./../../hooks/usePost";
import "./../../styles/Components.css"; // Adjust the path according to your project structure

const CreatePost = () => {
  const {
    formData,
    image,
    loading,
    error,
    successMessage,
    handleChange,
    handleSubmit,
  } = useCreatePost();

  return (
    <div className="container mt-4">
      <h1>Create Post</h1>
      {successMessage && (
        <Alert variant="success" dismissible>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" dismissible>
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
            {/* Render primary categories here */}
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
            {/* Render subcategories here */}
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
          <Form.Control type="file" accept="image/*" onChange={handleChange} />
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
