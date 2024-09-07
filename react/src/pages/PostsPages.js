import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./../pages/Layouts";
import PostList from "../components/Posts/PostList";
import PostDetail from "../components/Posts/PostDetail";
import CreatePost from "../components/Posts/CreatePost";
import UpdatePost from "../components/Posts/UpdatePost";
import ManageTags from "../components/Posts/ManageTags";
import PostEngagements from "../components/Posts/PostEngagements";
import PostCard from "../components/Posts/PostCard";
import ProtectedRoute from "../components/common/ProtectedRoute"; // Ensure you have this import

const PostsPages = () => {
  const crumbs = [
    { label: "Home", path: "/" },
    { label: "Posts", path: "/posts" },
  ];

  return (
    <Layout crumbs={crumbs}>
      <Routes>
        {/* Public Routes */}
        <Route path="/posts" exact>
          <PostList />
        </Route>
        <Route path="/posts/detail/:id">
          <PostDetail />
        </Route>
        <Route path="/posts/card">
          <PostCard />
        </Route>

        {/* Protected Routes */}
        <ProtectedRoute path="/posts/create">
          <CreatePost />
        </ProtectedRoute>
        <ProtectedRoute path="/posts/update/:id">
          <UpdatePost />
        </ProtectedRoute>
        <ProtectedRoute path="/posts/manage-tags">
          <ManageTags />
        </ProtectedRoute>
        <ProtectedRoute path="/posts/engagements">
          <PostEngagements />
        </ProtectedRoute>
      </Routes>
    </Layout>
  );
};

export default PostsPages;
