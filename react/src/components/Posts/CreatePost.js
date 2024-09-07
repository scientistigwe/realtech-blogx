import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useCreatePost } from "../../hooks/usePosts";
import { useCategoriesList } from "../../hooks/useCategories";
import "./../../styles/Components.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CreatePost = () => {
  const {
    categories,
    error: categoriesError,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategoriesList();
  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading,
    error,
    successMessage,
  } = useCreatePost({
    title: "",
    content: "",
    excerpt: "",
    metaDescription: "",
    metaTitle: "",
    metaKeywords: "",
    publicationDate: "",
    coreCategory: "",
    subcategory: "",
    tags: "",
    thumbnail: null,
    isPublic: false,
  });

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (formData.coreCategory) {
      setFilteredSubcategories(
        categories.filter(
          (category) => category.parent_id === formData.coreCategory
        )
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.coreCategory, categories]);

  const displayTags = Array.isArray(formData.tags)
    ? formData.tags.join(", ")
    : "";

  const CodeBlock = ({ children }) => {
    const match = children.trim().match(/^```(\w+)?\n([\s\S]+?)\n```$/);
    if (!match) return <>{children}</>;

    const [, lang = "javascript", code] = match;
    return (
      <SyntaxHighlighter
        language={lang}
        style={coy}
        customStyle={{ marginBottom: "1rem" }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    );
  };

  const renderContent = () => {
    const lines = formData.content.split("\n");
    const renderedLines = [];
    let inCodeBlock = false;
    let codeBlock = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "```") {
        if (inCodeBlock) {
          renderedLines.push(
            <CodeBlock key={i}>{codeBlock.join("\n")}</CodeBlock>
          );
          codeBlock = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
      } else {
        if (inCodeBlock) {
          codeBlock.push(lines[i]);
        } else {
          renderedLines.push(<div key={i}>{line}</div>);
        }
      }
    }

    if (inCodeBlock) {
      renderedLines.push(
        <CodeBlock key={lines.length}>{codeBlock.join("\n")}</CodeBlock>
      );
    }

    return renderedLines;
  };

  const isSubmitDisabled = loading;

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {categoriesError && (
        <Alert variant="danger">{categoriesError.message}</Alert>
      )}
      {categoriesLoading && <Spinner animation="border" />}
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
          <textarea
            className="form-control"
            rows={10}
            placeholder={`Enter post content (code blocks start and end with \`\`\`)`}
            name="content"
            value={formData.content}
            onChange={handleChange}
          >
            {renderContent()}
          </textarea>
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
          <Form.Label>Core Category*</Form.Label>
          <Form.Control
            as="select"
            name="coreCategory"
            value={formData.coreCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select a core category</option>
            {categories
              .filter((cat) => !cat.parent_id)
              .map((category) => (
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
            disabled={!formData.coreCategory}
          >
            <option value="">Select a subcategory</option>
            {filteredSubcategories.map((subcategory) => (
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
            placeholder="Enter tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPostThumbnail" className="mt-3">
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type="file"
            name="thumbnail"
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.files[0] })
            }
          />
        </Form.Group>

        <Form.Group controlId="formIsPublic" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Make post public"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isSubmitDisabled}>
          {loading ? <Spinner animation="border" size="sm" /> : "Create Post"}
        </Button>
      </Form>
    </div>
  );
};

export default CreatePost;
