import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearTokens } from "../redux/auth/authSlice";

const useInactivityLogout = (timeout = 3600000) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clearAllStorage = useCallback(() => {
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear local storage
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();

    // Clear Redux state
    dispatch(clearTokens());

    // Redirect to homepage
    navigate("/");
  }, [navigate, dispatch]);

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(clearAllStorage, timeout);
    };

    // Set up event listeners for user activity
    const events = [
      "mousedown",
      "keypress",
      "scroll",
      "mousemove",
      "touchstart",
    ];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
    };
  }, [timeout, clearAllStorage]);
};

export default useInactivityLogout;
