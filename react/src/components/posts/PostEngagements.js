// components/PostEngagement.js
import React from "react";
import { Button, Col, ListGroup } from "react-bootstrap";
import { postService } from "../../services/postsService";
import "../../styles/Components.css";

const PostEngagement = ({ post }) => {
  const handleUpvote = async () => {
    try {
      await postService.upvotePost(post.id);
      // Optionally refetch or update the post data
    } catch (err) {
      console.error("Error upvoting post:", err);
    }
  };

  const handleDownvote = async () => {
    try {
      await postService.downvotePost(post.id);
      // Optionally refetch or update the post data
    } catch (err) {
      console.error("Error downvoting post:", err);
    }
  };

  return (
    <Col>
      <ListGroup.Item>
        <h5>{post.title}</h5>
        <p>{post.summary}</p>
        <div className="d-flex">
          <Button onClick={handleUpvote} className="me-2">
            Upvote
          </Button>
          <Button onClick={handleDownvote} className="me-2">
            Downvote
          </Button>
        </div>
      </ListGroup.Item>
    </Col>
  );
};

export default PostEngagement;
