import { useState, useEffect, useCallback } from "react";
import api from "../../../../react/src/api/api";
import debounce from "lodash/debounce";

const useNavbarData = () => {
  const [data, setData] = useState({
    categories: [],
    searchResults: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [categoriesResponse] = await Promise.all([api.categories.list()]);

      // Ensure data is an array, even if API response is unexpected
      setData({
        categories: Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : [],
        searchResults: [],
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const searchPosts = useCallback(
    debounce(async (query) => {
      if (!query) return; // Avoid empty searches
      try {
        const response = await api.posts.search({ params: { query } });
        setData((prevData) => ({
          ...prevData,
          searchResults: Array.isArray(response.data) ? response.data : [],
        }));
      } catch (err) {
        setError(err.message);
      }
    }, 300),
    []
  );

  return { data, loading, error, searchPosts };
};

export default useNavbarData;
