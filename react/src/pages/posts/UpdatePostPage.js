import React, { useEffect } from "react";
import { Breadcrumb, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { usePostDetails, useUpdatePost } from "./../../hooks/usePost"; // Adjust the path according to your project structure
import UpdatePost from "./../../components/Posts/UpdatePost"; // Ensure this path is correct

import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const UpdatePostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // Use custom hooks to get post details and update logic
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

  useEffect(() => {
    // Fetch the post details when the component mounts
    // This effect is handled by the custom hook, so no need to manually dispatch actions
  }, [postId]);

  const handleUpdatePost = async (updatedPostData) => {
    try {
      await updatePost(postId, updatedPostData);
      navigate(`/posts/${postId}`); // Redirect to post detail page after successful update
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (postLoading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (postError || updateError) {
    return (
      <Container className="text-center mt-4">
        <Alert variant="danger">{postError || updateError}</Alert>
      </Container>
    );
  }

  return (
    <Container className="post-edit-page">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/posts" }}>
          Posts
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/posts/${postId}` }}>
          Post Details
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Post</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Edit Post</h1>
      <UpdatePost post={post} onSubmit={handleUpdatePost} />
    </Container>
  );
};

export default UpdatePostPage;
