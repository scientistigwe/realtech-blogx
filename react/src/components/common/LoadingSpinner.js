// src/components/common/LoadingSpinner.js
import React from "react";
import "../../styles/LoadingSpinner.css"; // You can define custom styles for the spinner

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        {/* You can use any loading spinner implementation you prefer */}
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
