import React from "react";
import RecommendationsList from "../components/recommendations/RecommendationsList";
import RealTimeRecommendations from "../components/recommendations/RealTimeRecommendations";
import RecommendationForm from "../components/recommendations/RecommendationForm";

const RecommendationsPage = () => (
  <div>
    <h1>Recommendations</h1>
    <RecommendationsList />
    <RealTimeRecommendations />
    <RecommendationForm />
  </div>
);

export default RecommendationsPage;
