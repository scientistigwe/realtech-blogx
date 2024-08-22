import { useState } from "react";
import api from "./../api/apiClient";

// Comment Hooks
export const useCommentList = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.comments.fetchForPost(postId);
      setComments(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { comments, loading, error, fetchComments };
};

export const useCreateComment = (postId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createComment = async (data) => {
    setLoading(true);
    try {
      await api.comments.create(postId, data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createComment, loading, error };
};
