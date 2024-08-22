import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export const usePagination = (apiFunction, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const query = queryString.parse(location.search);
        const page = query.page ? parseInt(query.page, 10) : 1;
        setCurrentPage(page);
        const response = await apiFunction(page);
        setItems(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [apiFunction, itemsPerPage, location.search]);

  return { currentPage, totalPages, items, loading, error };
};
