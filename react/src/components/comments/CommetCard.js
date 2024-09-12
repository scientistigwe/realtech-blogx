// components/comments/CommentCard.js
import React, { useState } from "react";
import { Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { commentService } from "../../services/commentService";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const CommentCard = ({ comment }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpvote = async () => {
    setLoading(true);
    try {
      await commentService.upvoteComment(comment.id);
      setSuccess("Comment upvoted successfully!");
    } catch (err) {
      setError("Failed to upvote comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownvote = async () => {
    setLoading(true);
    try {
      await commentService.downvoteComment(comment.id);
      setSuccess("Comment downvoted successfully!");
    } catch (err) {
      setError("Failed to downvote comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async () => {
    setLoading(true);
    try {
      await commentService.moderateComment(comment.id);
      setSuccess("Comment moderated successfully!");
    } catch (err) {
      setError("Failed to moderate comment.");
    } finally {
      setLoading(false);
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
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {loading && <Spinner animation="border" />}
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="outline-success"
            onClick={handleUpvote}
            disabled={loading}
          >
            Upvote
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleDownvote}
            disabled={loading}
          >
            Downvote
          </Button>
          <Button
            variant="outline-warning"
            onClick={handleModerate}
            disabled={loading}
          >
            Moderate
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommentCard;
