import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchNavbar from "./components/common/SearchNavbar";

// Authentication
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Posts
import PostList from "./components/posts/PostList";
import PostDetail from "./components/posts/PostDetail";

function App() {
  const handleSearch = (term) => {
    console.log(`Searching for: ${term}`);
    // Add actual search logic here
  };

  return (
    <Router>
      <Header />
      <SearchNavbar onSearch={handleSearch} />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />

        {/* Catch-all Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
