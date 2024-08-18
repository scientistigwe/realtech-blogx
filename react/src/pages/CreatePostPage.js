import React, { useEffect } from "react";
import { Breadcrumb, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost, clearError } from "../redux/slices/postsSlice";
import CreatePost from "../components/Posts/CreatePost";
import "./../styles/Layout.css";
import "./../styles/Pages.css";
import "./../styles/Global.css";
import "./../styles/Components.css";

const CreatePostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCreatePost = async (postData) => {
    try {
      await dispatch(createPost(postData)).unwrap();
      navigate("/posts"); // Redirect to the posts list page after successful creation
    } catch (error) {
      console.error("Error creating post:", error);
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
