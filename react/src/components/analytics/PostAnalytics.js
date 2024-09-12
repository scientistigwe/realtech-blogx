// components/PostAnalytics.js
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "../../styles/Analytics.css"; // Create or update styles as necessary

const PostAnalytics = ({ analyticsData }) => {
  if (!analyticsData) return <p>Loading analytics data...</p>;

  // Prepare data for charts (example for a bar chart)
  const chartData = {
    labels: analyticsData.map((post) => post.title),
    datasets: [
      {
        label: "Views",
        data: analyticsData.map((post) => post.views),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Votes",
        data: analyticsData.map((post) => post.votes),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Comments",
        data: analyticsData.map((post) => post.comments),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Row>
      <Col md={6}>
        <Card className="mb-4">
          <Card.Body>
            <h4>
              Total Views:{" "}
              {analyticsData.reduce((acc, post) => acc + post.views, 0)}
            </h4>
            <h4>
              Total Votes:{" "}
              {analyticsData.reduce((acc, post) => acc + post.votes, 0)}
            </h4>
            <h4>
              Total Comments:{" "}
              {analyticsData.reduce((acc, post) => acc + post.comments, 0)}
            </h4>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <div className="analytics-chart">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Col>
    </Row>
  );
};

export default PostAnalytics;
