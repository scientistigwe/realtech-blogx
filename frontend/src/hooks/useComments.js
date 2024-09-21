import { useState, useCallback } from "react";
import { commentService } from "../services/commentsService"; // Adjust the path as necessary

export const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeCommentOperation = useCallback(async (operation, ...args) => {
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

  const fetchComments = useCallback(
    () => executeCommentOperation(commentService.fetchComments),
    [executeCommentOperation]
  );
  const createComment = useCallback(
    (data) => executeCommentOperation(commentService.createComment, data),
    [executeCommentOperation]
  );
  const getCommentById = useCallback(
    (id) => executeCommentOperation(commentService.getCommentById, id),
    [executeCommentOperation]
  );
  const updateComment = useCallback(
    (id, data) =>
      executeCommentOperation(commentService.updateComment, id, data),
    [executeCommentOperation]
  );
  const partialUpdateComment = useCallback(
    (id, data) =>
      executeCommentOperation(commentService.partialUpdateComment, id, data),
    [executeCommentOperation]
  );
  const deleteComment = useCallback(
    (id) => executeCommentOperation(commentService.deleteComment, id),
    [executeCommentOperation]
  );
  const upvoteComment = useCallback(
    (id) => executeCommentOperation(commentService.upvoteComment, id),
    [executeCommentOperation]
  );
  const downvoteComment = useCallback(
    (id) => executeCommentOperation(commentService.downvoteComment, id),
    [executeCommentOperation]
  );
  const moderateComment = useCallback(
    (id) => executeCommentOperation(commentService.moderateComment, id),
    [executeCommentOperation]
  );

  return {
    fetchComments,
    createComment,
    getCommentById,
    updateComment,
    partialUpdateComment,
    deleteComment,
    upvoteComment,
    downvoteComment,
    moderateComment,
    loading,
    error,
  };
};
