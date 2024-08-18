import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import PostList from "../components/Posts/PostList";
import "./../styles/Layout.css";
import "./../styles/Pages.css";
import "./../styles/Global.css";
import "./../styles/Components.css";

const PostsListPage = () => {
  return (
    <Container className="post-page">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Posts</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Posts</h1>
      <PostList />
    </Container>
  );
};

export default PostsListPage;
