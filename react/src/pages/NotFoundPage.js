import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import "./../styles/Global.css"; // Optional: Create a CSS file for additional styling

const NotFoundPage = () => {
  return (
    <Container className="mt-5 text-center">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>404 Not Found</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col>
          <h1 className="display-4">404</h1>
          <h2>Oops! Page Not Found</h2>
          <p className="lead">
            It looks like the page you’re looking for doesn’t exist or has been
            moved.
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
