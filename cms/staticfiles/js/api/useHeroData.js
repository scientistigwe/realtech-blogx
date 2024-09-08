import { useState, useEffect, useCallback } from "react";
import api from "../../../../react/src/api/api"; // Import the api object

const useHeroData = () => {
  const [data, setData] = useState({
    posts: [],
    error: null,
    loading: true,
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await api.posts.mostViewed(); // Fetch most viewed posts
      setData({ posts: response.data, error: null, loading: false });
    } catch (error) {
      setData({ posts: [], error: error.message, loading: false });
    }
  }, []); // Empty dependency array ensures fetchData doesn't change

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency array includes fetchData

  return data;
};

export default useHeroData;
