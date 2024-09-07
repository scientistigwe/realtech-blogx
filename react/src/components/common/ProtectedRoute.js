import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useIsAuthenticated();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
