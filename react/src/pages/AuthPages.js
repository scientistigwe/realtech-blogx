import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../pages/Layouts";
import Register from "../components/Auth/Register";
import Login from "../components/Auth/Login";
import ForgotPassword from "../components/Auth/ForgotPassword";
import PasswordReset from "../components/Auth/PasswordReset";
import ProtectedRoute from "../components/common/ProtectedRoute"; // Ensure this component is correctly implemented

console.log("Authpages loading....");

const AuthPages = () => {
  const crumbs = [
    { label: "Home", path: "/" },
    { label: "Auth", path: "/auth" },
  ];

  return (
    <Layout crumbs={crumbs}>
      <Routes>
        {/* Public Routes within Auth */}
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Protected Route for Password Reset */}
        <Route
          path="password-reset"
          element={
            <ProtectedRoute>
              <PasswordReset />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route for Auth */}
        <Route path="*" element={<div>Please select a valid auth route</div>} />
      </Routes>
    </Layout>
  );
};

export default AuthPages;
