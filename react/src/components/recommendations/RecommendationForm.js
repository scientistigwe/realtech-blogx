import React, { useState } from "react";

function RecommendationForm() {
  const [userId, setUserId] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/recommendations/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setRecommendations(data.recommendations || []);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Get Recommendations</button>
      </form>
      <ul>
        {recommendations.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecommendationForm;
