import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth"; // Import the useAuth hook

const ProtectedRoute = () => {
  const { checkAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        const isAuth = await checkAuth(); // Use the hook's method
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        Error checking authentication:{" "}
        {error.message || "Failed to verify authentication."}
      </Alert>
    );
  }

  // Determine if this is a public or protected route
  const isPublicRoute = ["/", "/home", "/about", "/contact"].includes(
    window.location.pathname
  );

  // Redirect based on authentication state
  if (isAuthenticated === false && !isPublicRoute) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated === true || isPublicRoute) {
    return <Outlet />;
  }

  return null; // Fallback case
};

export default ProtectedRoute;
