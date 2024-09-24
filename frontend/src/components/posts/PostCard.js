import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/PostCard.css";

const PostCard = ({ post }) => {
  return (
    <Card className="post-card mb-3">
      {post.thumbnail && (
        <Card.Img variant="top" src={post.thumbnail} alt={post.title} />
      )}
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          By {post.author.username}
        </Card.Subtitle>
        <Card.Text>
          {post.excerpt ||
            (post.content.length > 100
              ? `${post.content.substring(0, 100)}...`
              : post.content)}
        </Card.Text>
        <div className="post-meta">
          <p>
            Published on: {new Date(post.publication_date).toLocaleDateString()}
          </p>
          <p>Views: {post.view_count}</p>
          {post.category && <p>Category: {post.category.name}</p>}
        </div>
        <div className="post-stats">
          <p>Upvotes: {post.upvotes}</p>
          <p>Downvotes: {post.downvotes}</p>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <p>Tags: {post.tags.map((tag) => tag.name).join(", ")}</p>
          </div>
        )}
        <Link to={`/post/${post.slug}`}>
          <Button variant="primary">Read More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
