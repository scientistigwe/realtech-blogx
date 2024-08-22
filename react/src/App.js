import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostsListPage from "./pages/posts/PostsListPage";
import PostDetailPage from "./pages/posts/PostDetailPage";
import CreatePostPage from "./pages/posts/CreatePostPage";
import UpdatePostPage from "./pages/posts/UpdatePostPage";
import ProfilePage from "./pages/authenticationAndUserManagement/ProfilePage";
import AuthorListPage from "./pages/authenticationAndUserManagement/AuthorListPage";
import AuthorProfilePage from "./pages/authenticationAndUserManagement/AuthorProfilePage";
import TagListPage from "./pages/TagListPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ModerationPage from "./pages/ModerationPage";
import ContactAuthor from "./components/Authors/ContactAuthor";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PasswordReset from "./components/Auth/PasswordReset";
import CommentCreate from "./components/Comments/CommentCreate";
import CommentList from "./components/Comments/CommentList";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Profile from "./components/Profile/UserProfile";
import ProfileUpdateForm from "./components/Profile/ProfileUpdateForm";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/authors" element={<AuthorListPage />} />
        <Route path="/authors/:id" element={<AuthorProfilePage />} />
        <Route path="/tags" element={<TagListPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/contact" element={<ContactAuthor />} />
        <Route path="/comments/create" element={<CommentCreate />} />
        <Route path="/comments" element={<CommentList />} />

        {/* Protected Routes */}
        <Route
          path="/create-post"
          element={<ProtectedRoute element={<CreatePostPage />} />}
        />
        <Route
          path="/posts/edit/:id"
          element={<ProtectedRoute element={<UpdatePostPage />} />}
        />
        <Route
          path="/profile/:id"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />
        <Route
          path="/profile/:id/view"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/profile/:id/update"
          element={<ProtectedRoute element={<ProfileUpdateForm />} />}
        />
        <Route
          path="/analytics"
          element={<ProtectedRoute element={<AnalyticsPage />} />}
        />
        <Route
          path="/recommendations"
          element={<ProtectedRoute element={<RecommendationsPage />} />}
        />
        <Route
          path="/moderation"
          element={<ProtectedRoute element={<ModerationPage />} />}
        />
        {/* <Route
          path="/moderation/approved"
          element={<ProtectedRoute element={<ApprovedContentPage />} />}
        />
        <Route
          path="/moderation/rejected"
          element={<ProtectedRoute element={<RejectedContentPage />} />}
        />
        <Route
          path="/moderation/users"
          element={<ProtectedRoute element={<UserManagementPage />} />}
        />
        <Route
          path="/moderation/settings"
          element={<ProtectedRoute element={<ModeratorSettingsPage />} />}
        /> */}

        {/* Catch-All Route for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
