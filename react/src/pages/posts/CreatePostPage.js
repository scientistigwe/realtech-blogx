import React from "react";
import { Breadcrumb, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCreatePost } from "./../../hooks/usePost"; // Adjust the path according to your project structure
import CreatePost from "../../components/Posts/CreatePost";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { createPost, loading, error } = useCreatePost();

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
      navigate("/posts"); // Redirect to the posts list page after successful creation
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="post-create-page">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/posts" }}>
          Posts
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Create Post</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Create New Post</h1>
      <CreatePost onSubmit={handleCreatePost} />
    </Container>
  );
};

export default CreatePostPage;
