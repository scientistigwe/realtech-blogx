import React, { useEffect, useState } from "react";
import { Breadcrumb, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import PostDetail from "./../../components/Posts/PostDetail";
import api from "./../../api/apiClient";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        setError("Failed to load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
        <Breadcrumb.Item active>
          {post ? post.title : "Post Details"}
        </Breadcrumb.Item>
      </Breadcrumb>

      {post && <PostDetail post={post} />}
    </Container>
  );
};

export default PostDetailPage;
