import { useState, useCallback } from "react";
import { tagService } from "../services/tagsService"; // Adjust the path as necessary

export const useTags = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeTagOperation = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listTags = useCallback(
    () => executeTagOperation(tagService.listTags),
    [executeTagOperation]
  );
  const createTag = useCallback(
    (data) => executeTagOperation(tagService.createTag, data),
    [executeTagOperation]
  );
  const getTagById = useCallback(
    (id) => executeTagOperation(tagService.getTagById, id),
    [executeTagOperation]
  );
  const updateTag = useCallback(
    (id, data) => executeTagOperation(tagService.updateTag, id, data),
    [executeTagOperation]
  );
  const partialUpdateTag = useCallback(
    (id, data) => executeTagOperation(tagService.partialUpdateTag, id, data),
    [executeTagOperation]
  );
  const deleteTag = useCallback(
    (id) => executeTagOperation(tagService.deleteTag, id),
    [executeTagOperation]
  );

  return {
    listTags,
    createTag,
    getTagById,
    updateTag,
    partialUpdateTag,
    deleteTag,
    loading,
    error,
  };
};
