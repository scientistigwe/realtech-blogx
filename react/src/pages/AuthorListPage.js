// src/pages/AuthorListPage.js

import React, { useEffect } from "react";
import { Container, Breadcrumb, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthors } from "../redux/slices/authorsSlice"; // Adjust import path as needed
import {
  selectAllAuthors,
  selectLoading,
  selectError,
} from "../redux/selectors/authorsSelectors";
import AuthorList from "../components/Authors/AuthorList"; // Adjust import path as needed

const AuthorListPage = () => {
  const dispatch = useDispatch();

  // Access state using selectors
  const authors = useSelector(selectAllAuthors);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

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
