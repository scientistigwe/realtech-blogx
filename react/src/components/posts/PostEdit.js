// components/posts/PostEdit.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { postService } from "../../services/postsService";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PostEdit = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await postService.getPostById(id);
        setPost(fetchedPost);
      } catch (err) {
        setError("Failed to fetch post.");
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.updatePost(id, post);
      setSuccess("Post updated successfully!");
    } catch (err) {
      setError("Failed to update post.");
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Edit Post</h2>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Title */}
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={post.title}
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
            value={post.content}
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
            value={post.excerpt}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author */}
        <Form.Group controlId="formAuthorUsername">
          <Form.Label>Author Username</Form.Label>
          <Form.Control
            type="text"
            name="author.username"
            value={post.author.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Author Email */}
        <Form.Group controlId="formAuthorEmail">
          <Form.Label>Author Email</Form.Label>
          <Form.Control
            type="email"
            name="author.email"
            value={post.author.email}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author First Name */}
        <Form.Group controlId="formAuthorFirstName">
          <Form.Label>Author First Name</Form.Label>
          <Form.Control
            type="text"
            name="author.first_name"
            value={post.author.first_name}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author Last Name */}
        <Form.Group controlId="formAuthorLastName">
          <Form.Label>Author Last Name</Form.Label>
          <Form.Control
            type="text"
            name="author.last_name"
            value={post.author.last_name}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author Bio */}
        <Form.Group controlId="formAuthorBio">
          <Form.Label>Author Bio</Form.Label>
          <Form.Control
            type="text"
            name="author.bio"
            value={post.author.bio}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author Website */}
        <Form.Group controlId="formAuthorWebsite">
          <Form.Label>Author Website</Form.Label>
          <Form.Control
            type="text"
            name="author.website"
            value={post.author.website}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Author Location */}
        <Form.Group controlId="formAuthorLocation">
          <Form.Label>Author Location</Form.Label>
          <Form.Control
            type="text"
            name="author.location"
            value={post.author.location}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Status */}
        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            type="text"
            name="status"
            value={post.status}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Meta Description */}
        <Form.Group controlId="formMetaDescription">
          <Form.Label>Meta Description</Form.Label>
          <Form.Control
            type="text"
            name="meta_description"
            value={post.meta_description}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Meta Title */}
        <Form.Group controlId="formMetaTitle">
          <Form.Label>Meta Title</Form.Label>
          <Form.Control
            type="text"
            name="meta_title"
            value={post.meta_title}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Publication Date */}
        <Form.Group controlId="formPublicationDate">
          <Form.Label>Publication Date</Form.Label>
          <Form.Control
            type="date"
            name="publication_date"
            value={post.publication_date}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Meta Keywords */}
        <Form.Group controlId="formMetaKeywords">
          <Form.Label>Meta Keywords</Form.Label>
          <Form.Control
            type="text"
            name="meta_keywords"
            value={post.meta_keywords}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Is Public */}
        <Form.Group controlId="formIsPublic">
          <Form.Check
            type="checkbox"
            name="is_public"
            label="Is Public"
            checked={post.is_public}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Category */}
        <Form.Group controlId="formCategoryName">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            name="category.name"
            value={post.category.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Category Slug */}
        <Form.Group controlId="formCategorySlug">
          <Form.Label>Category Slug</Form.Label>
          <Form.Control
            type="text"
            name="category.slug"
            value={post.category.slug}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Category Parent */}
        <Form.Group controlId="formCategoryParent">
          <Form.Label>Category Parent</Form.Label>
          <Form.Control
            type="number"
            name="category.parent"
            value={post.category.parent || ""}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Thumbnail */}
        <Form.Group controlId="formThumbnail">
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
          />
          {post.thumbnail && (
            <img
              src={URL.createObjectURL(post.thumbnail)}
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
