import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layouts";

// Pages
import AuthPages from "./pages/AuthPages";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import AuthorPages from "./pages/AuthorPages";
import CommentsPages from "./pages/CommentsPages";
import HomePage from "./pages/HomePage";
import ModerationPage from "./pages/ModerationPage";
import NotFoundPage from "./pages/NotFoundPage";
import NotificationPage from "./pages/NotificationsPage";
import PostsPages from "./pages/PostsPages";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPages from "./pages/RecommendationsPages";
import SearchPage from "./pages/SearchPage";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route path="/auth/*" element={<AuthPages />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="/authors" element={<AuthorPages />} />
        <Route path="/comments" element={<CommentsPages />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/recommendations/*" element={<RecommendationsPages />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Protected Routes */}
        <Route path="/posts/*" element={<PostsPages />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/moderation" element={<ModerationPage />} />

        {/* Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </ErrorBoundary>
);
export default App;
