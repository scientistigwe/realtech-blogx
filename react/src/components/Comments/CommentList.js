import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  deleteComment,
  updateComment,
} from "../../redux/slices/commentsSlice"; // Adjust import path as needed
import CommentDelete from "./CommentDelete"; // Adjust import path as needed
import CommentUpdate from "./CommentUpdate"; // Adjust import path as needed

const CommentList = ({ postId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);
  const [localComments, setLocalComments] = useState(comments);

  useEffect(() => {
    dispatch(fetchComments(postId))
      .unwrap()
      .then((fetchedComments) => setLocalComments(fetchedComments))
      .catch((err) => console.error("Failed to fetch comments:", err));
  }, [postId, dispatch]);

  const handleCommentDeleted = async (commentId) => {
    // Optimistic UI update
    const updatedComments = localComments.filter(
      (comment) => comment.id !== commentId
    );
    setLocalComments(updatedComments);

    try {
      await dispatch(deleteComment(commentId)).unwrap();
      // Refetch comments to ensure consistency
      const fetchedComments = await dispatch(fetchComments(postId)).unwrap();
      setLocalComments(fetchedComments);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      // Rollback optimistic update
      setLocalComments(comments);
    }
  };

  const handleCommentUpdated = async (commentId, newContent) => {
    // Optimistic UI update
    const updatedComments = localComments.map((comment) =>
      comment.id === commentId ? { ...comment, content: newContent } : comment
    );
    setLocalComments(updatedComments);

    try {
      await dispatch(
        updateComment({ commentId, content: newContent })
      ).unwrap();
      // Refetch comments to ensure consistency
      const fetchedComments = await dispatch(fetchComments(postId)).unwrap();
      setLocalComments(fetchedComments);
    } catch (err) {
      console.error("Failed to update comment:", err);
      // Rollback optimistic update
      setLocalComments(comments);
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error)
    return (
      <div className="error-message" style={{ color: "red" }}>
        {error}
      </div>
    );

  return (
    <div className="comment-list">
      <h3>Comments</h3>
      {localComments.length > 0 ? (
        <ul>
          {localComments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <small>By {comment.author.id}</small>
              <CommentUpdate
                commentId={comment.id}
                initialContent={comment.content}
                onCommentUpdated={(newContent) =>
                  handleCommentUpdated(comment.id, newContent)
                }
              />
              <CommentDelete
                commentId={comment.id}
                onCommentDeleted={() => handleCommentDeleted(comment.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div>No comments yet. Be the first to comment!</div>
      )}
    </div>
  );
};

export default CommentList;
