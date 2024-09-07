import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { useCommentsList } from "../../hooks/useComments"; // Custom hook for fetching comments

const CommentList = ({ postId }) => {
  const { comments, loading, error } = useCommentsList(postId);

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );

  return (
    <div className="comment-list">
      <h3>Comments</h3>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.author_name}</strong>: {comment.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default CommentList;
