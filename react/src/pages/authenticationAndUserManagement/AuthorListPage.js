import React, { useEffect, useState } from "react";
import { Container, Breadcrumb, Spinner, Alert } from "react-bootstrap";
import api from "./../../api/apiClient"; // Adjust the path if needed
import AuthorList from "./../../components/Authors/AuthorList"; // Adjust the path if needed

const AuthorListPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.authors.list(); // Fetch authors from API
        setAuthors(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch authors");
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Authors</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Authors</h1>
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}
      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}
      {!loading && !error && <AuthorList authors={authors} />}
    </Container>
  );
};

export default AuthorListPage;
