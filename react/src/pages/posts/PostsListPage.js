import React from "react";
import { Link } from "react-router-dom";
import { Container, Breadcrumb } from "react-bootstrap";
import PostCard from "./../../components/Posts/PostCard";
import Pagination from "./../../components/common/Pagination";
import { usePostList } from "./../../hooks/usePost";
import { usePagination } from "../../hooks/usePagination";
import api from "../../api/apiClient";

import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const PostListPage = () => {
  const { posts, loading: postsLoading, error } = usePostList();
  const {
    currentPage,
    totalPages,
    items,
    loading: paginationLoading,
  } = usePagination(
    api.posts.fetchAll, // Ensure this is the correct API call for fetching posts
    10
  );

  if (postsLoading || paginationLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container className="post-page mt-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Posts</Breadcrumb.Item>
      </Breadcrumb>

      <h1>All Posts</h1>
      <div>
        {items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
      <Link to="/create-post" className="btn btn-primary mt-3">
        Create Post
      </Link>
    </Container>
  );
};

export default PostListPage;
