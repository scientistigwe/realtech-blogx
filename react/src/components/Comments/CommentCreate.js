import React, { useState } from "react";
import { useCreateComment } from "./../../hooks/useComment";
import "./../../styles/Components.css";

const CommentForm = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const { createComment, loading, error } = useCreateComment(postId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createComment({ content });
      setContent("");
      if (onCommentCreated) onCommentCreated(); // Notify parent to refresh comments
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("You must be logged in to post a comment.");
      } else {
        console.error("Error posting comment:", err);
      }
    }
  };

  return (
    <div className="comment-form">
      <h3>Leave a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          required
          rows="4"
          cols="50"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
        {error && (
          <div className="error-message" style={{ color: "red" }}>
            {error.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentForm;
