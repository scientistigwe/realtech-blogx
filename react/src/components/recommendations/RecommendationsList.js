import React, { useEffect, useState } from "react";
import apiClient from "./../../api/apiInterceptor"; // Replace with the correct path to your apiInterceptor

function RecommendationsList({ userId }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (userId) {
      apiClient
        .get(`/api/recommendations/${userId}`)
        .then((response) =>
          setRecommendations(response.data.recommendations || [])
        )
        .catch((error) =>
          console.error("Error fetching recommendations:", error)
        );
    }
  }, [userId]);

  return (
    <div>
      <h2>Recommended for You</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecommendationsList;
