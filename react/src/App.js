import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Authentication
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import PasswordReset from "./components/auth/PasswordReset";
import PasswordResetConfirmation from "./components/auth/PasswordResetConfirmation";
import SetPassword from "./components/auth/SetPassword";

// Profile
import UserProfile from "./components/profile/UserProfile";

// Posts
import PostList from "./components/posts/PostList";
import PostDetail from "./components/posts/PostDetail";
import PostCreate from "./components/posts/PostCreate";
import PostEdit from "./components/posts/PostEdit";
import PostSlugCheck from "./components/posts/PostSlugCheck";
import FeaturedPosts from "./components/posts/FeaturedPosts";
import MostViewedPosts from "./components/posts/MostViewedPosts";
import PostsByCategory from "./components/posts/PostsByCategory";

// Comments
import CommentList from "./components/comments/CommentList";
import CreateComment from "./components/comments/CreateComment";
import UpdateComment from "./components/comments/UpdateComment";
import DeleteComment from "./components/comments/DeleteComment";

// Notifications
import NotificationList from "./components/notifications/NotificationList";
import NotificationDetail from "./components/notifications/NotificationDetail";
import NotificationCreate from "./components/notifications/NotificationCreate";
import NotificationUpdate from "./components/notifications/NotificationUpdate";

// Authors
import AuthorList from "./components/authors/AuthorList";
import AuthorDetail from "./components/authors/AuthorDetail";
import ContactAuthor from "./components/authors/ContactAuthor";

// Analytics
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";

// Moderation
import ModerationDashboard from "./components/moderation/ModerationDashboard";

// Recommendations
import RecommendationsList from "./components/recommendations/RecommendationsList";
import RecommendationForm from "./components/recommendations/RecommendationForm";
import RealTimeRecommendations from "./components/recommendations/RealTimeRecommendations";

// Search
import SearchPosts from "./components/Search/SearchPosts";

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <ErrorBoundary>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route
            path="/password-reset-confirmation"
            element={<PasswordResetConfirmation />}
          />
          <Route path="/set-password" element={<SetPassword />} />

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/posts/slug-check" element={<PostSlugCheck />} />
          <Route path="/posts/featured" element={<FeaturedPosts />} />
          <Route path="/posts/most-viewed" element={<MostViewedPosts />} />
          <Route path="/posts/by-category" element={<PostsByCategory />} />
          <Route path="/comments" element={<CommentList />} />
          <Route path="/notifications" element={<NotificationList />} />
          <Route
            path="/notifications/:notificationId"
            element={<NotificationDetail />}
          />
          <Route path="/authors" element={<AuthorList />} />
          <Route path="/authors/:authorId" element={<AuthorDetail />} />
          <Route path="/search" element={<SearchPosts />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/posts/create" element={<PostCreate />} />
            <Route path="/posts/edit/:postId" element={<PostEdit />} />
            <Route path="/comments/create" element={<CreateComment />} />
            <Route
              path="/comments/edit/:commentId"
              element={<UpdateComment />}
            />
            <Route
              path="/comments/delete/:commentId"
              element={<DeleteComment />}
            />
            <Route
              path="/notifications/create"
              element={<NotificationCreate />}
            />
            <Route
              path="/notifications/edit/:notificationId"
              element={<NotificationUpdate />}
            />
            <Route path="/contact-author" element={<ContactAuthor />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/moderation" element={<ModerationDashboard />} />
            <Route path="/recommendations" element={<RecommendationsList />} />
            <Route
              path="/recommendations/create"
              element={<RecommendationForm />}
            />
            <Route
              path="/recommendations/realtime"
              element={<RealTimeRecommendations />}
            />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
}

export default App;
