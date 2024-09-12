// components/authors/AuthorList.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authorService } from "../../services/authorService";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await authorService.listAuthors();
        setAuthors(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) return <p>Loading authors...</p>;
  if (error)
    return (
      <Alert variant="danger">Error loading authors: {error.message}</Alert>
    );

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Authors</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Authors</h2>
          {authors.length > 0 ? (
            <ListGroup>
              {authors.map((author) => (
                <ListGroup.Item key={author.id}>
                  <Link
                    to={`/authors/${author.id}`}
                    className="text-decoration-none"
                  >
                    {author.name}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">No authors found.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AuthorList;
