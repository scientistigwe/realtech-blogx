import React from "react";
import { Button, Col, ListGroup } from "react-bootstrap";
import { usePosts } from "../../hooks/usePosts";
import "../../styles/Components.css";

const PostEngagement = ({ post }) => {
  const { upvotePost, error: upvoteError, loading: upvoteLoading } = usePosts();
  const {
    downvotePost,
    error: downvoteError,
    loading: downvoteLoading,
  } = usePosts();

  const handleUpvote = async () => {
    try {
      await upvotePost(post.id);
      // Optionally refetch or update the post data
    } catch (err) {
      console.error("Error upvoting post:", upvoteError || err);
    }
  };

  const handleDownvote = async () => {
    try {
      await downvotePost(post.id);
      // Optionally refetch or update the post data
    } catch (err) {
      console.error("Error downvoting post:", downvoteError || err);
    }
  };

  return (
    <Col>
      <ListGroup.Item>
        <h5>{post.title}</h5>
        <p>{post.summary}</p>
        <div className="d-flex">
          <Button
            onClick={handleUpvote}
            className="me-2"
            disabled={upvoteLoading}
          >
            {upvoteLoading ? "Upvoting..." : "Upvote"}
          </Button>
          <Button
            onClick={handleDownvote}
            className="me-2"
            disabled={downvoteLoading}
          >
            {downvoteLoading ? "Downvoting..." : "Downvote"}
          </Button>
        </div>
        {(upvoteError || downvoteError) && (
          <div className="text-danger mt-2">{upvoteError || downvoteError}</div>
        )}
      </ListGroup.Item>
    </Col>
  );
};

export default PostEngagement;
