import React, { useEffect } from "react";
import { Breadcrumb, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearError } from "../redux/slices/postsSlice";
import PostDetail from "../components/Posts/PostDetail";
import "./../styles/Layout.css";
import "./../styles/Pages.css";
import "./../styles/Global.css";
import "./../styles/Components.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts.currentPost);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPostById(id));

    return () => {
      dispatch(clearError());
    };
  }, [id, dispatch]);

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
    <Container className="post-detail-page">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/posts" }}>
          Posts
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Post Details</Breadcrumb.Item>
      </Breadcrumb>

      <PostDetail post={post} />
    </Container>
  );
};

export default PostDetailPage;
