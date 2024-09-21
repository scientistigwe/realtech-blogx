import { useState, useEffect, useCallback } from "react";
import { authorService } from "../services/authorService"; // Adjust the path

const useAuthorOperation = (initialState = null) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeOperation = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, executeOperation };
};

export const useListAuthors = () => {
  const {
    data: authors,
    loading,
    error,
    executeOperation,
  } = useAuthorOperation([]);

  useEffect(() => {
    executeOperation(authorService.listAuthors);
  }, [executeOperation]);

  return { authors, loading, error };
};

export const useGetAuthorById = (id) => {
  const {
    data: author,
    loading,
    error,
    executeOperation,
  } = useAuthorOperation(null);

  useEffect(() => {
    if (id) {
      executeOperation(authorService.getAuthorById, id);
    }
  }, [id, executeOperation]);

  return { author, loading, error };
};

export const useContactAuthor = () => {
  const {
    data: response,
    loading,
    error,
    executeOperation,
  } = useAuthorOperation(null);

  const contactAuthor = useCallback(
    (id, data) => {
      return executeOperation(authorService.contactAuthor, id, data);
    },
    [executeOperation]
  );

  return { contactAuthor, response, loading, error };
};

export const useSearchAuthors = (query) => {
  const {
    data: authors,
    loading,
    error,
    executeOperation,
  } = useAuthorOperation([]);

  useEffect(() => {
    if (query) {
      executeOperation(authorService.searchAuthors, query);
    }
  }, [query, executeOperation]);

  return { authors, loading, error };
};
