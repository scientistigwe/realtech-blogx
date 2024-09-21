import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/PostCard.css";

const PostCard = ({ post }) => {
  return (
    <Card className="post-card">
      <Card.Img
        variant="top"
        src={post.thumbnailUrl}
        className="post-thumbnail"
      />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>
          {post.content.length > 100
            ? `${post.content.substring(0, 100)}...`
            : post.content}
        </Card.Text>
        <Card.Subtitle className="mb-2 text-muted">
          Published on {new Date(post.publicationDate).toLocaleDateString()}
        </Card.Subtitle>
        <Card.Text>Votes: {post.voteCount}</Card.Text>
        <Card.Text>Comments: {post.commentCount}</Card.Text>
        <Link to={`/posts/${post.id}`}>
          <Button variant="primary">Read More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
