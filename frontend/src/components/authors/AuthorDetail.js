import React from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Alert,
  Card,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetAuthorById } from "../../hooks/useAuthors";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const AuthorDetail = () => {
  const { id } = useParams();
  const { author, loading, error } = useGetAuthorById(id);

  if (loading) return <p>Loading author details...</p>;
  if (error)
    return (
      <Alert variant="danger">
        Error loading author details: {error.message}
      </Alert>
    );

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/authors">Authors</Breadcrumb.Item>
        <Breadcrumb.Item active>{author?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {author && (
            <Card>
              <Card.Body>
                <Card.Title>{author.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {author.role}
                </Card.Subtitle>
                <Card.Text>{author.bio}</Card.Text>
                <Button variant="primary" href={`mailto:${author.email}`}>
                  Contact Author
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AuthorDetail;
