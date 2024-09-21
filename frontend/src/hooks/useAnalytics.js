import { useState, useEffect, useCallback } from "react";
import { postService } from "../services/postsService"; // Adjust the path

export const usePostAnalytics = (userId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executePostAnalyticsOperation = useCallback(
    async (operation, ...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await operation(...args);
        setAnalytics(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (userId) {
      executePostAnalyticsOperation(postService.fetchPostAnalytics, userId);
    }
  }, [userId, executePostAnalyticsOperation]);

  const refetchAnalytics = useCallback(() => {
    if (userId) {
      return executePostAnalyticsOperation(
        postService.fetchPostAnalytics,
        userId
      );
    }
  }, [userId, executePostAnalyticsOperation]);

  return { analytics, loading, error, refetchAnalytics };
};
