import { useState, useEffect } from "react";
import api from "../api/api"; // Adjust the path according to your project structure

// Hook to list all comments
export const useListComments = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.comments.list();
      setComments(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return { comments, error, loading };
};

// Hook to create a new comment
export const useCreateComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createComment = async (data) => {
    setLoading(true);
    try {
      const res = await api.comments.create(data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, createComment };
};

// Hook to get a comment by ID
export const useGetCommentById = (id) => {
  const [comment, setComment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCommentById = async () => {
    setLoading(true);
    try {
      const res = await api.comments.read(id);
      setComment(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentById();
  }, [id]);

  return { comment, error, loading };
};

// Hook to update a comment by ID
export const useUpdateComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateComment = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.comments.update(id, data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, updateComment };
};

// Hook to partially update a comment by ID
export const usePartialUpdateComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const partialUpdateComment = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.comments.partialUpdate(id, data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, partialUpdateComment };
};

// Hook to delete a comment by ID
export const useDeleteComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteComment = async (id) => {
    setLoading(true);
    try {
      const res = await api.comments.delete(id);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, deleteComment };
};

// Hook to upvote a comment by ID
export const useUpvoteComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const upvoteComment = async (id) => {
    setLoading(true);
    try {
      const res = await api.comments.upvote(id);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, upvoteComment };
};

// Hook to downvote a comment by ID
export const useDownvoteComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const downvoteComment = async (id) => {
    setLoading(true);
    try {
      const res = await api.comments.downvote(id);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, downvoteComment };
};

// Hook to moderate a comment by ID
export const useModerateComment = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const moderateComment = async (id) => {
    setLoading(true);
    try {
      const res = await api.comments.moderate(id);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, moderateComment };
};
