import { useState, useEffect, useCallback } from "react";
import api from "../api/apiClient"; // Adjust import path as necessary

const useSearchPosts = (initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to perform the search
  const performSearch = useCallback(async (searchQuery) => {
    setQuery(searchQuery);
  }, []);

  // Effect to fetch posts when query changes
  useEffect(() => {
    if (!query) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/posts/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setResults(data);
      } catch (error) {
        setError(error.message || "Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  return {
    results,
    loading,
    error,
    performSearch,
  };
};

export default useSearchPosts;
