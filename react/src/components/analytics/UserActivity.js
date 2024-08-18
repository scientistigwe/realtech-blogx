import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Container, Row, Col, Card } from "react-bootstrap";
import apiClient from "./../../api/apiInterceptor";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserActivity = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user activity data using apiClient
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/user-activity");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user activity data:", error);
      }
    };

    fetchUserData();
  }, []);

  const lineChartData = {
    labels: userData?.dailyActivity?.dates || [],
    datasets: [
      {
        label: "Daily Active Users",
        data: userData?.dailyActivity?.counts || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: userData?.activityBreakdown?.categories || [],
    datasets: [
      {
        label: "Activity Breakdown",
        data: userData?.activityBreakdown?.values || [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">User Activity Insights</h1>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Daily Active Users</Card.Title>
              {userData ? (
                <Line data={lineChartData} options={{ responsive: true }} />
              ) : (
                <p>Loading activity data...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Activity Breakdown</Card.Title>
              {userData ? (
                <Bar data={barChartData} options={{ responsive: true }} />
              ) : (
                <p>Loading activity breakdown...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Statistics (optional) */}
      {userData && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Summary Statistics</Card.Title>
            <p>Total Active Users: {userData.totalActiveUsers}</p>
            <p>Peak Activity Time: {userData.peakActivityTime}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserActivity;
