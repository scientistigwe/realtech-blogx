import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import Navbar from "./components/Layouts/Navbar";
import HomePage from "./pages/HomePage";
import PostsListPage from "./pages/PostsListPage"; // Import PostPage
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import UpdatePostPage from "./pages/UpdatePostPage";
import ProfilePage from "./pages/ProfilePage";
import Profile from "./components/Profile/UserProfile";
import ProfileUpdateForm from "./components/Profile/ProfileUpdateForm";
import AuthorListPage from "./pages/AuthorListPage";
import AuthorProfilePage from "./pages/AuthorProfilePage";
import TagListPage from "./pages/TagListPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ModerationPage from "./pages/ModerationPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PasswordReset from "./components/Auth/PasswordReset";
import CommentCreate from "./components/Comments/CommentCreate";
import CommentList from "./components/Comments/CommentList";
import { AuthContext } from "./context/AuthProvider";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsListPage />} />{" "}
        {/* Add PostPage route */}
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/authors" element={<AuthorListPage />} />
        <Route path="/authors/:id" element={<AuthorProfilePage />} />
        <Route path="/tags" element={<TagListPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/posts/edit/:id" element={<UpdatePostPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/:id/view" element={<Profile />} />
            <Route path="/profile/:id/update" element={<ProfileUpdateForm />} />
            <Route path="/comments/create" element={<CommentCreate />} />
            <Route path="/comments" element={<CommentList />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/moderation" element={<ModerationPage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        {/* Catch-All Route for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
