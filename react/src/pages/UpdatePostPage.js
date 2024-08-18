import React, { useEffect } from "react";
import { Breadcrumb, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  updatePost,
  clearError,
} from "../redux/slices/postsSlice";
import UpdatePost from "../components/Posts/UpdatePost";
import "./../styles/Layout.css";
import "./../styles/Pages.css";
import "./../styles/Global.css";
import "./../styles/Components.css";

const UpdatePostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const post = useSelector((state) => state.posts.currentPost);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPostById(id));

    return () => {
      dispatch(clearError());
    };
  }, [id, dispatch]);

  const handleUpdatePost = async (updatedPostData) => {
    try {
      await dispatch(updatePost({ id, ...updatedPostData })).unwrap();
      navigate(`/posts/${id}`); // Redirect to post detail page after successful update
    } catch (error) {
      console.error("Error updating post:", error);
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
    <Container className="post-edit-page">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/posts" }}>
          Posts
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/posts/${id}` }}>
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
