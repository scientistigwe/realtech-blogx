import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Container, Row, Col, Card } from "react-bootstrap";
import apiClient from "./../../api/apiInterceptor";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Fetch both dashboard and analytics data
    const fetchData = async () => {
      try {
        const [dashboardResponse, analyticsResponse] = await Promise.all([
          apiClient.get("/dashboard-data/"),
          apiClient.get("/analytics/"),
        ]);

        setDashboardData(dashboardResponse.data);
        setAnalyticsData(analyticsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Total Views",
        data: analyticsData?.monthlyViews || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Analytics Dashboard</h1>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Views Over Time</Card.Title>
              <Line data={chartData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Dashboard Metrics</Card.Title>
              {dashboardData ? (
                <div>
                  <h2>Site Metrics</h2>
                  <p>Page Views: {dashboardData.page_views}</p>
                  <p>Unique Visitors: {dashboardData.unique_visitors}</p>
                  <h2>User Insights</h2>
                  <p>Active Users: {dashboardData.active_users}</p>
                  <h2>Content Performance</h2>
                  <p>Top Posts: {dashboardData.top_posts.join(", ")}</p>
                </div>
              ) : (
                <p>Loading dashboard data...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsDashboard;
