import React, { useState } from "react";
import { Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { useComments } from "../../hooks/useComments";

const CommentCard = ({ comment }) => {
  const { upvoteComment, downvoteComment, moderateComment, loading } =
    useComments();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  const handleUpvote = async () => {
    setLocalLoading(true);
    try {
      await upvoteComment(comment.id);
      setLocalSuccess("Comment upvoted successfully!");
    } catch (err) {
      setLocalError("Failed to upvote comment.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDownvote = async () => {
    setLocalLoading(true);
    try {
      await downvoteComment(comment.id);
      setLocalSuccess("Comment downvoted successfully!");
    } catch (err) {
      setLocalError("Failed to downvote comment.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleModerate = async () => {
    setLocalLoading(true);
    try {
      await moderateComment(comment.id);
      setLocalSuccess("Comment moderated successfully!");
    } catch (err) {
      setLocalError("Failed to moderate comment.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>
          <strong>{comment.author}</strong>{" "}
          <Badge bg="secondary">{comment.date}</Badge>
        </Card.Title>
        <Card.Text>{comment.content}</Card.Text>
        {localError && <Alert variant="danger">{localError}</Alert>}
        {localSuccess && <Alert variant="success">{localSuccess}</Alert>}
        {localLoading || loading ? <Spinner animation="border" /> : null}
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="outline-success"
            onClick={handleUpvote}
            disabled={localLoading || loading}
          >
            Upvote
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleDownvote}
            disabled={localLoading || loading}
          >
            Downvote
          </Button>
          <Button
            variant="outline-warning"
            onClick={handleModerate}
            disabled={localLoading || loading}
          >
            Moderate
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommentCard;
