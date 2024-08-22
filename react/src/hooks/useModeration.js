import { useState, useEffect, useCallback } from "react";
import api from "../api/apiClient"; // Adjust the import path as necessary

export const usePendingContent = () => {
  const [pendingContent, setPendingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending content
  useEffect(() => {
    const fetchPendingContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.moderation.pendingContent(); // Adjust API method as necessary
        if (!response.ok) throw new Error("Failed to fetch pending content");
        setPendingContent(response.data);
      } catch (error) {
        setError(error.message || "Failed to load pending content.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingContent();
  }, []);

  // Approve content
  const approveContent = useCallback(async (contentId) => {
    try {
      const response = await api.moderation.approveContent(contentId);
      if (!response.ok) throw new Error("Failed to approve content");
      // Remove approved content from state
      setPendingContent((prev) => prev.filter((item) => item.id !== contentId));
    } catch (error) {
      setError(error.message || "Failed to approve content.");
    }
  }, []);

  // Reject content
  const rejectContent = useCallback(async (contentId) => {
    try {
      const response = await api.moderation.rejectContent(contentId);
      if (!response.ok) throw new Error("Failed to reject content");
      // Remove rejected content from state
      setPendingContent((prev) => prev.filter((item) => item.id !== contentId));
    } catch (error) {
      setError(error.message || "Failed to reject content.");
    }
  }, []);

  return { pendingContent, loading, error, approveContent, rejectContent };
};
