import React, { useEffect } from "react";

const useInactivityLogout = (timeoutDuration = 3600000) => {
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        // Log out the user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login
      }, timeoutDuration);
    };

    // Set up event listeners for user interactions
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Start the timer
    resetTimer();

    // Cleanup event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [timeoutDuration]);
};

export default useInactivityLogout;
