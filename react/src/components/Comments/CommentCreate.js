import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/slices/commentsSlice"; // Adjust import path as needed
import { AuthContext } from "../../context/AuthProvider";

const CommentCreate = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const { sentiment, error, loading } = useSelector((state) => state.comments);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Here you might want to handle this more gracefully
      alert("You must be logged in to post a comment.");
      return;
    }

    try {
      await dispatch(createComment({ postId, content })).unwrap();
      setContent("");
      if (onCommentCreated) onCommentCreated(); // Notify parent to refresh comments or handle newly created comment
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  useEffect(() => {
    // Reset error and sentiment when content changes
    if (error) dispatch({ type: "comments/clearError" }); // Example action to clear error
  }, [content, error, dispatch]);

  return (
    <div className="comment-create">
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
            {error}
          </div>
        )}
        {sentiment && <p>Sentiment: {sentiment}</p>}
      </form>
    </div>
  );
};

export default CommentCreate;
