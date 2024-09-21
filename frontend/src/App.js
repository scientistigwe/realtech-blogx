// src/App.js
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchNavbar from "./components/common/SearchNavbar";
import Dashboard from "./components/analytics/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserProfile from "./components/profile/UserProfile";
import PostList from "./components/posts/PostList";
import PostDetail from "./components/posts/PostDetail";
import useInactivityLogout from "./hooks/useInactivityLogout";
import { checkAuth } from "./redux/auth/authThunks";
import { clearTokens, setTokens } from "./redux/auth/authSlice";
import api from "./utils/api";

function App() {
  useInactivityLogout(3600000); // Set to 1 hour
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSearch = async (term) => {
    try {
      const results = await api.get(`/search?term=${encodeURIComponent(term)}`);
      console.log("Search results:", results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  useEffect(() => {
    const performAuthCheck = async () => {
      const accessToken = sessionStorage.getItem("access_token");
      const refreshToken = sessionStorage.getItem("refresh_token");

      if (!accessToken || !refreshToken) {
        dispatch(clearTokens());
        return;
      }

      dispatch(setTokens({ accessToken, refreshToken }));

      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        console.error("Auth check error:", error);
        dispatch(clearTokens());
      }
    };

    performAuthCheck();
  }, [dispatch, location]);

  return (
    <>
      <Header />
      <SearchNavbar onSearch={handleSearch} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
