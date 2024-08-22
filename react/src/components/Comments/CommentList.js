import React, { useEffect, useState } from "react";
import { useCommentList } from "./../../hooks/useComment";

const CommentList = ({ postId }) => {
  const {
    comments,
    loading,
    error,
    refetchComments,
    deleteComment,
    updateComment,
  } = useCommentList(postId);
  const [localComments, setLocalComments] = useState(comments);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (comments) {
      setLocalComments(comments);
    }
  }, [comments]);

  const handleCommentDeleted = async (commentId) => {
    const updatedComments = localComments.filter(
      (comment) => comment.id !== commentId
    );
    setLocalComments(updatedComments);

    try {
      await deleteComment(commentId);
      await refetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setLocalComments(comments);
    }
  };

  const handleCommentUpdated = async (commentId) => {
    const updatedComments = localComments.map((comment) =>
      comment.id === commentId ? { ...comment, content: editContent } : comment
    );
    setLocalComments(updatedComments);

    try {
      await updateComment(commentId, editContent);
      await refetchComments();
      setEditingCommentId(null);
    } catch (err) {
      console.error("Failed to update comment:", err);
      setLocalComments(comments);
    }
  };

  const startEditing = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="error-message" style={{ color: "red" }}>
        {error.message}
      </div>
    );
  }

  return (
    <div className="comment-list">
      <h3>Comments</h3>
      {localComments.length > 0 ? (
        <ul>
          {localComments.map((comment) => (
            <li key={comment.id}>
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button onClick={() => handleCommentUpdated(comment.id)}>
                    Save
                  </button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  <small>By {comment.author.username}</small>
                  <button
                    onClick={() => startEditing(comment.id, comment.content)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleCommentDeleted(comment.id)}>
                    Delete
                  </button>
                </div>
              )}
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
