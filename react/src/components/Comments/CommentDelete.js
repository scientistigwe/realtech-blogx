import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../redux/slices/commentsSlice"; // Adjust import path as needed

const CommentDelete = ({ commentId, onCommentDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.comments);

  const handleDelete = async () => {
    try {
      await dispatch(deleteComment(commentId)).unwrap();
      onCommentDeleted(); // Notify parent to refresh the comment list or handle deletion
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="comment-delete">
      <button onClick={() => setShowConfirm(true)} disabled={loading}>
        {loading ? "Deleting..." : "Delete Comment"}
      </button>

      {showConfirm && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this comment?</p>
          <button onClick={handleDelete} disabled={loading}>
            Confirm
          </button>
          <button onClick={() => setShowConfirm(false)} disabled={loading}>
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CommentDelete;
