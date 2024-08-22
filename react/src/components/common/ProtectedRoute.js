import React from "react";
import { Route, Navigate } from "react-router-dom";
import useAuth from "./../../hooks/userAuth"; // Custom hook to check authentication status

const ProtectedRoute = ({ element, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optionally show a spinner or loading indicator
  }

  return isAuthenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
