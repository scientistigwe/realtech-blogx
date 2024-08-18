import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateComment } from "../../redux/slices/commentsSlice"; // Adjust the import path as necessary

const CommentUpdate = ({ commentId, initialContent, onCommentUpdated }) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic form validation
    if (content.trim() === "") {
      setError("Comment content cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      await dispatch(updateComment({ commentId, content })).unwrap();
      onCommentUpdated(); // Notify parent to refresh the comment list or handle the updated comment
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-update">
      <h3>Update Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Update your comment here..."
          required
          rows="4"
          cols="50"
          aria-label="Update Comment"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Comment"}
        </button>
        {error && (
          <div className="error-message" style={{ color: "red" }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentUpdate;
