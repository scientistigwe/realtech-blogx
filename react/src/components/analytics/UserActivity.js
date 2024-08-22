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
import api from "./../../api/apiClient"; // Updated to match your API client

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user activity data
    const fetchUserData = async () => {
      try {
        const response = await api.get("/user-activity");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user activity data:", error);
      } finally {
        setLoading(false);
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

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Daily Active Users</Card.Title>
                {userData?.dailyActivity ? (
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Users: ${context.raw}`,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <p>No data available for daily active users.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Activity Breakdown</Card.Title>
                {userData?.activityBreakdown ? (
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${context.raw}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Categories",
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Values",
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <p>No data available for activity breakdown.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

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
