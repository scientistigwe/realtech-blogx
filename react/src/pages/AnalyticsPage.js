import React from "react";
import Dashboard from "./../components/analytics/AnalyticsDashboard"; // Adjust path as needed
import UserActivity from "./../components/analytics/UserActivity"; // Adjust path as needed
import { Container, Row, Col } from "react-bootstrap";

const AnalyticsPage = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Analytics Overview</h1>
      <Row>
        <Col md={6}>
          <Dashboard />
        </Col>
        <Col md={6}>
          <UserActivity />
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsPage;
