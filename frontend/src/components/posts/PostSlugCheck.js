import React from "react";
import { Container, Form, Button, Alert, Breadcrumb } from "react-bootstrap";
import { usePosts } from "../../hooks/usePosts";
import "../../styles/Components.css";

const PostSlugCheck = () => {
  const { slug, setSlug, available, error, loading, checkSlug } =
    usePosts.checkPostSlug();

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Check Post Slug</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Check Post Slug Availability</h2>
      <Form>
        <Form.Group controlId="slug">
          <Form.Label>Post Slug</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={checkSlug}
          className="mt-3"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Slug"}
        </Button>
      </Form>
      {error && (
        <Alert variant="danger" className="mt-3">
          Error: {error}
        </Alert>
      )}
      {available !== null && (
        <Alert variant={available ? "success" : "danger"} className="mt-3">
          {available ? "Slug is available!" : "Slug is taken."}
        </Alert>
      )}
    </Container>
  );
};

export default PostSlugCheck;
