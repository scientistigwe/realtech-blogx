import React from "react";
import { Route, Routes, useParams, useLocation } from "react-router-dom";
import Layout from "./../pages/Layouts";
import CommentList from "../components/Comments/CommentList";
import AddComment from "../components/Comments/addComment";
import EditComment from "../components/Comments/editComment";
import ProtectedRoute from "../components/common/ProtectedRoute";

const CommentsPages = () => {
  const { pathname } = useLocation();
  const crumbs = [
    { label: "Home", path: "/" },
    { label: "Comments", path: "/comments" },
  ];

  return (
    <Layout crumbs={crumbs}>
      <Routes>
        {/* Route for CommentList (unprotected) */}
        <Route path="/comments" exact>
          <CommentList />
        </Route>

        {/* Protected Routes */}
        <ProtectedRoute path="/comments/add">
          <AddComment />
        </ProtectedRoute>
        <ProtectedRoute path="/comments/edit/:id">
          <EditComment />
        </ProtectedRoute>
      </Routes>
    </Layout>
  );
};

export default CommentsPages;
