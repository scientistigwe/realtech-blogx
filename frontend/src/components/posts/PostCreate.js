import React, { useState, useCallback, useRef, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/post/postThunks";
import {
  selectPostsLoading,
  selectPostsError,
  selectPostCreationSuccess,
} from "../../redux/post/postSlice";
import { selectAuth } from "../../redux/auth/authSlice";
import { Editor } from "@tinymce/tinymce-react";
import CategorySelection from "./../common/CategorySelection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Posts.css";

const PostCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const creationSuccess = useSelector(selectPostCreationSuccess);
  const currentUser = useSelector(selectAuth);
  const editorRef = useRef(null);

  const isAdmin = currentUser?.is_superuser || currentUser?.is_admin;

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: isAdmin ? "published" : "draft",
    meta_description: "",
    meta_title: "",
    publication_date: "",
    meta_keywords: "",
    is_public: false,
    category_id: null,
    thumbnail: null,
    tag_names: [], // Changed from tag_ids to tag_names
    view_count: 0,
    upvotes: 0,
    downvotes: 0,
  });

  useEffect(() => {
    if (creationSuccess) {
      toast.success("Post created successfully!");
      navigate("/"); // Redirect to homepage
    }
  }, [creationSuccess, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleEditorChange = useCallback((content) => {
    setPost((prevPost) => ({ ...prevPost, content }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    setPost((prevPost) => ({ ...prevPost, thumbnail: file }));
  }, []);

  const handleCategoryChange = useCallback((categoryId) => {
    setPost((prevPost) => ({
      ...prevPost,
      category_id: categoryId,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!post.title || !post.content) {
      alert("Title and Content are required fields.");
      return false;
    }
    return true;
  }, [post]);

  const handleTagChange = useCallback((e) => {
    const tagNames = e.target.value.split(",").map((tag) => tag.trim());
    setPost((prevPost) => ({ ...prevPost, tag_names: tagNames }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if (key === "thumbnail" && post[key]) {
          formData.append(key, post[key]);
        } else if (key === "tag_names") {
          formData.append(key, JSON.stringify(post[key]));
        } else {
          formData.append(key, post[key]);
        }
      });

      dispatch(createPost(formData));
    },
    [dispatch, post, validateForm]
  );

  return (
    <Container className="post-create-container">
      <h2 className="text-center mb-4">Create Blog Post</h2>
      <Form onSubmit={handleSubmit} className="post-create-form">
        {loading && <p className="loading-message">Loading...</p>}
        {error && (
          <Alert variant="danger" className="alert-danger">
            {error}
          </Alert>
        )}

        <Form.Group controlId="formTitle" className="form-group">
          <Form.Label className="form-label">Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
            className="form-control"
          />
        </Form.Group>

        <Form.Group controlId="formContent" className="form-group">
          <Form.Label className="form-label">Content</Form.Label>
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={post.content}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table code help wordcount codesample",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | codesample | code | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              codesample_languages: [
                { text: "HTML/XML", value: "markup" },
                { text: "JavaScript", value: "javascript" },
                { text: "CSS", value: "css" },
                { text: "PHP", value: "php" },
                { text: "Ruby", value: "ruby" },
                { text: "Python", value: "python" },
                { text: "Java", value: "java" },
                { text: "C", value: "c" },
                { text: "C#", value: "csharp" },
                { text: "C++", value: "cpp" },
              ],
            }}
            onEditorChange={(content, editor) => {
              setPost((prevPost) => ({ ...prevPost, content }));
            }}
          />
        </Form.Group>

        <Form.Group controlId="formExcerpt" className="form-group">
          <Form.Label className="form-label">Excerpt</Form.Label>
          <Form.Control
            type="text"
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            placeholder="Enter a brief excerpt of the post"
            className="form-control"
          />
        </Form.Group>

        {/* Status is hidden from non-admin users */}
        {isAdmin && (
          <Form.Group controlId="formStatus" className="form-group">
            <Form.Label className="form-label">Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={post.status}
              onChange={handleChange}
              className={styles.formControl}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group controlId="formMetaDescription" className="form-group">
          <Form.Label className="form-label">Meta Description</Form.Label>
          <Form.Control
            type="text"
            name="meta_description"
            value={post.meta_description}
            onChange={handleChange}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="formMetaTitle" className="form-group">
          <Form.Label className="form-label">Meta Title</Form.Label>
          <Form.Control
            type="text"
            name="meta_title"
            value={post.meta_title}
            onChange={handleChange}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="formPublicationDate" className="form-group">
          <Form.Label className="form-label">Publication Date</Form.Label>
          <Form.Control
            type="date"
            name="publication_date"
            value={post.publication_date}
            onChange={handleChange}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="formMetaKeywords" className="form-group">
          <Form.Label className="form-label">Meta Keywords</Form.Label>
          <Form.Control
            type="text"
            name="meta_keywords"
            value={post.meta_keywords}
            onChange={handleChange}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="formTags" className="form-group">
          <Form.Label className="form-label">Tags</Form.Label>
          <Form.Control
            type="text"
            value={post.tag_names.join(", ")}
            onChange={handleTagChange}
            placeholder="Enter tags separated by commas (e.g., technology, programming, web development)"
            className="form-control"
          />
        </Form.Group>

        <Form.Group controlId="formThumbnail" className="form-group">
          <Form.Label className="form-label">Thumbnail</Form.Label>
          <Form.Control
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            className={styles.formControl}
          />
        </Form.Group>

        <CategorySelection onCategoryChange={handleCategoryChange} />

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Creating Post..." : "Create Post"}
        </Button>
      </Form>
    </Container>
  );
};

export default PostCreate;
